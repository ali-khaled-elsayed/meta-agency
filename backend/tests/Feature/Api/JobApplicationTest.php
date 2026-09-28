<?php

namespace Tests\Feature\Api;

use App\Mail\JobApplicationReceived;
use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class JobApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
        Mail::fake();
        RateLimiter::clear('forms-minute:127.0.0.1');
        SiteSetting::put('contact_email', 'info@meta-egypt-agency.com');
    }

    private function pdf(string $name = 'cv.pdf'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, "%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << >>\n%%EOF");
    }

    private function payload(array $overrides = []): array
    {
        return [
            'position' => 'Graphic Designer',
            'first_name' => 'Omar',
            'last_name' => 'Hassan',
            'email' => 'omar@example.com',
            'phone' => '01000000000',
            'linkedin_url' => 'https://www.linkedin.com/in/omar',
            'consent' => '1',
            'cv' => $this->pdf(),
            ...$overrides,
        ];
    }

    public function test_a_valid_application_is_stored_privately_and_notified(): void
    {
        $this->post('/api/v1/job-applications', $this->payload(), ['Accept' => 'application/json'])->assertCreated();

        $application = JobApplication::firstOrFail();

        $this->assertSame('Graphic Designer', $application->position);
        $this->assertSame('cv.pdf', $application->cv_original_name);
        $this->assertStringStartsWith('job-applications/', $application->cv_path);
        $this->assertStringEndsWith('.pdf', $application->cv_path);
        Storage::disk('local')->assertExists($application->cv_path);
        Storage::disk('public')->assertMissing($application->cv_path);
        Mail::assertQueued(JobApplicationReceived::class);
    }

    public function test_an_application_can_target_an_open_job(): void
    {
        $job = JobPosting::factory()->create(['slug' => 'art-director', 'title' => ['en' => 'Art Director']]);

        $this->post('/api/v1/job-applications', $this->payload(['job_slug' => 'art-director', 'position' => null]), ['Accept' => 'application/json'])
            ->assertCreated();

        $this->assertDatabaseHas(JobApplication::class, ['job_posting_id' => $job->id, 'position' => 'Art Director']);
    }

    public function test_required_fields_and_consent_are_validated(): void
    {
        $this->postJson('/api/v1/job-applications', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'phone', 'cv', 'consent', 'position']);
    }

    public function test_disallowed_extensions_are_rejected(): void
    {
        foreach (['cv.exe', 'cv.php', 'cv.js', 'cv.html'] as $name) {
            $this->post('/api/v1/job-applications', $this->payload(['cv' => UploadedFile::fake()->createWithContent($name, 'payload')]), ['Accept' => 'application/json'])
                ->assertJsonValidationErrors('cv');
        }

        $this->assertDatabaseCount(JobApplication::class, 0);
    }

    public function test_executables_disguised_as_pdf_are_rejected_by_mime_type(): void
    {
        $fake = UploadedFile::fake()->createWithContent('cv.pdf', "MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00".str_repeat("\x00", 64).'This program cannot be run in DOS mode.');

        $this->post('/api/v1/job-applications', $this->payload(['cv' => $fake]), ['Accept' => 'application/json'])
            ->assertJsonValidationErrors('cv');
    }

    public function test_files_over_5mb_are_rejected(): void
    {
        $big = UploadedFile::fake()->create('cv.pdf', 6000, 'application/pdf');

        $this->post('/api/v1/job-applications', $this->payload(['cv' => $big]), ['Accept' => 'application/json'])
            ->assertJsonValidationErrors('cv');
    }

    public function test_field_requirements_follow_admin_settings(): void
    {
        SiteSetting::put('job_form_fields', ['portfolio_url' => 'required', 'expected_salary' => 'hidden']);

        $this->post('/api/v1/job-applications', $this->payload(['expected_salary' => '10000']), ['Accept' => 'application/json'])
            ->assertJsonValidationErrors(['portfolio_url', 'expected_salary']);
    }

    public function test_linkedin_url_must_point_to_linkedin(): void
    {
        $this->post('/api/v1/job-applications', $this->payload(['linkedin_url' => 'https://example.com/me']), ['Accept' => 'application/json'])
            ->assertJsonValidationErrors('linkedin_url');
    }
}
