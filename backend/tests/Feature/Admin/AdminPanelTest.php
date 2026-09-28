<?php

namespace Tests\Feature\Admin;

use App\Filament\Admin\Pages\ManageSiteSettings;
use App\Models\ContactMessage;
use App\Models\JobApplication;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    private const RESOURCES = [
        'pages', 'home-sections', 'services', 'projects', 'clients', 'testimonials', 'highlights', 'statistics',
        'team-members', 'faqs', 'blog-posts', 'blog-categories', 'job-postings', 'job-applications',
        'contact-messages', 'offices', 'social-links', 'redirects',
    ];

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->forceFill(['is_admin' => true])->save();

        return $user;
    }

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->seed(DatabaseSeeder::class);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_non_admin_users_cannot_access_the_panel(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
    }

    public function test_is_admin_cannot_be_mass_assigned(): void
    {
        try {
            User::create(['name' => 'x', 'email' => 'x@example.com', 'password' => 'secret123', 'is_admin' => true]);
        } catch (MassAssignmentException) {
            // Strict mode rejects the attribute outright.
        }

        $this->assertFalse((bool) User::where('email', 'x@example.com')->value('is_admin'));
    }

    public function test_admins_can_open_every_resource_list(): void
    {
        $this->actingAs($this->admin());

        $this->get('/admin')->assertOk();
        $this->get('/admin/site-settings')->assertOk();

        foreach (self::RESOURCES as $resource) {
            $this->get("/admin/$resource")->assertOk();
        }
    }

    public function test_admins_can_open_create_forms_except_for_inbox_resources(): void
    {
        $this->actingAs($this->admin());

        foreach (array_diff(self::RESOURCES, ['job-applications', 'contact-messages']) as $resource) {
            $this->get("/admin/$resource/create")->assertOk();
        }

        $this->get('/admin/job-applications/create')->assertNotFound();
        $this->get('/admin/contact-messages/create')->assertNotFound();
    }

    public function test_admins_can_open_seeded_edit_forms(): void
    {
        $this->actingAs($this->admin());

        $this->get('/admin/services/1/edit')->assertOk();
        $this->get('/admin/pages/1/edit')->assertOk();
        $this->get('/admin/home-sections/1/edit')->assertOk();
        $this->get('/admin/clients/1/edit')->assertOk();
    }

    public function test_opening_an_inbox_item_marks_it_as_read(): void
    {
        $this->actingAs($this->admin());
        $message = ContactMessage::create(['name' => 'A', 'email' => 'a@example.com', 'message' => 'Hello there team', 'status' => 'new']);
        $application = JobApplication::create([
            'first_name' => 'A', 'last_name' => 'B', 'email' => 'a@example.com', 'phone' => '0100',
            'cv_path' => 'job-applications/x.pdf', 'cv_original_name' => 'x.pdf', 'status' => 'new',
        ]);

        $this->get("/admin/contact-messages/{$message->id}/edit")->assertOk();
        $this->get("/admin/job-applications/{$application->id}/edit")->assertOk();

        $this->assertSame('read', $message->fresh()->status);
        $this->assertSame('reviewing', $application->fresh()->status);
    }

    public function test_site_settings_can_be_saved(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(ManageSiteSettings::class)
            ->set('data.contact_phone', '+201111111111')
            ->set('data.site_name.ar', 'ميتا إيجيبت')
            ->call('save')
            ->assertHasNoErrors();

        $this->assertSame('+201111111111', SiteSetting::get('contact_phone'));
        $this->assertSame('ميتا إيجيبت', SiteSetting::get('site_name')['ar']);
    }
}
