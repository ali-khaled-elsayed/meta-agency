<?php

namespace Tests\Feature\Api;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return [
            'name' => 'Sara Ahmed',
            'email' => 'sara@example.com',
            'phone' => '+20 100 000 0000',
            'company' => 'Acme',
            'service' => 'Web/App Development',
            'message' => 'We would like a new website for our brand.',
            ...$overrides,
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        RateLimiter::clear('forms-minute:127.0.0.1');
        SiteSetting::put('contact_email', 'info@meta-egypt-agency.com');
    }

    public function test_a_valid_message_is_stored_and_the_team_is_notified(): void
    {
        $this->postJson('/api/v1/contact', $this->payload())
            ->assertCreated()
            ->assertJsonStructure(['data' => ['id'], 'message']);

        $this->assertDatabaseHas(ContactMessage::class, ['email' => 'sara@example.com', 'status' => 'new']);
        Mail::assertQueued(ContactMessageReceived::class, fn ($mail) => $mail->hasTo('info@meta-egypt-agency.com'));
    }

    public function test_required_fields_are_validated(): void
    {
        $this->postJson('/api/v1/contact', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'message']);

        $this->assertDatabaseCount(ContactMessage::class, 0);
    }

    public function test_invalid_email_and_header_injection_are_rejected(): void
    {
        $this->postJson('/api/v1/contact', $this->payload(['email' => 'not-an-email']))->assertJsonValidationErrors('email');
        $this->postJson('/api/v1/contact', $this->payload(['email' => "a@example.com\r\nBcc: x@evil.test"]))->assertJsonValidationErrors('email');
    }

    public function test_html_is_stripped_from_input(): void
    {
        $this->postJson('/api/v1/contact', $this->payload(['message' => '<script>alert(1)</script>Hello there, new project please']))->assertCreated();

        $this->assertSame('alert(1)Hello there, new project please', ContactMessage::first()->message);
    }

    public function test_honeypot_submissions_are_rejected(): void
    {
        $this->postJson('/api/v1/contact', $this->payload(['website' => 'http://spam.test']))->assertUnprocessable();
        $this->assertDatabaseCount(ContactMessage::class, 0);
    }

    public function test_submissions_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/contact', $this->payload())->assertCreated();
        }

        $this->postJson('/api/v1/contact', $this->payload())->assertTooManyRequests();
    }

    public function test_private_fields_are_never_returned(): void
    {
        $content = $this->postJson('/api/v1/contact', $this->payload())->getContent();

        $this->assertStringNotContainsString('ip_address', $content);
        $this->assertStringNotContainsString('127.0.0.1', $content);
    }
}
