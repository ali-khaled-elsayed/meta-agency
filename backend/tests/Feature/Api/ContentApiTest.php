<?php

namespace Tests\Feature\Api;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\JobPosting;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use Database\Seeders\ContentSeeder;
use Database\Seeders\SettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_settings_expose_public_values_but_never_private_ones(): void
    {
        $this->seed(SettingsSeeder::class);
        SiteSetting::put('notification_emails', ['private@example.com']);

        $response = $this->getJson('/api/v1/settings')->assertOk();

        $response->assertJsonPath('data.site_name', 'Meta Egypt Agency')
            ->assertJsonPath('data.contact_email', 'info@meta-egypt-agency.com')
            ->assertJsonCount(3, 'data.statistics')
            ->assertJsonCount(2, 'data.offices')
            ->assertJsonCount(3, 'data.social_links')
            ->assertJsonPath('data.features.projects', false)
            ->assertJsonPath('data.features.blog', false)
            ->assertJsonMissingPath('data.notification_emails');

        $this->assertStringNotContainsString('private@example.com', $response->getContent());
    }

    public function test_services_list_only_published_services_in_order(): void
    {
        Service::factory()->create(['slug' => 'second', 'sort_order' => 2]);
        Service::factory()->create(['slug' => 'first', 'sort_order' => 1]);
        Service::factory()->inactive()->create(['slug' => 'hidden']);

        $this->getJson('/api/v1/services')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.slug', 'first')
            ->assertJsonPath('data.1.slug', 'second');
    }

    public function test_service_detail_includes_related_projects_and_navigation(): void
    {
        $first = Service::factory()->create(['slug' => 'branding', 'sort_order' => 1]);
        Service::factory()->create(['slug' => 'seo', 'sort_order' => 2]);
        Project::factory()->create(['service_id' => $first->id, 'slug' => 'case-study']);

        $this->getJson('/api/v1/services/branding')
            ->assertOk()
            ->assertJsonPath('data.slug', 'branding')
            ->assertJsonPath('data.projects.0.slug', 'case-study')
            ->assertJsonPath('meta.index', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.next.slug', 'seo');
    }

    public function test_inactive_or_missing_records_return_json_404(): void
    {
        Service::factory()->inactive()->create(['slug' => 'hidden']);

        $this->getJson('/api/v1/services/hidden')->assertNotFound()->assertJson(['message' => 'Resource not found.']);
        $this->getJson('/api/v1/projects/nope')->assertNotFound();
        $this->getJson('/api/v1/blog/nope')->assertNotFound();
    }

    public function test_arabic_is_returned_when_available_and_falls_back_to_english(): void
    {
        Service::factory()->create(['slug' => 'translated', 'title' => ['en' => 'Branding', 'ar' => 'الهوية'], 'excerpt' => ['en' => 'English only']]);

        $this->getJson('/api/v1/services/translated?locale=ar')
            ->assertOk()
            ->assertHeader('Content-Language', 'ar')
            ->assertJsonPath('data.title', 'الهوية')
            ->assertJsonPath('data.excerpt', 'English only');

        $this->getJson('/api/v1/services/translated', ['Accept-Language' => 'ar'])->assertJsonPath('data.title', 'الهوية');
        $this->getJson('/api/v1/services/translated?locale=fr')->assertHeader('Content-Language', 'en');
    }

    public function test_rich_text_is_sanitized_in_responses(): void
    {
        Service::factory()->create([
            'slug' => 'unsafe',
            'body' => ['en' => '<p onclick="steal()">Hello</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'],
        ]);

        $body = $this->getJson('/api/v1/services/unsafe')->json('data.body');

        $this->assertStringContainsString('Hello', $body);
        $this->assertStringNotContainsString('<script', $body);
        $this->assertStringNotContainsString('onclick', $body);
        $this->assertStringNotContainsString('javascript:', $body);
    }

    public function test_blog_lists_only_published_posts_and_supports_filters(): void
    {
        $news = BlogCategory::factory()->create(['slug' => 'news']);
        BlogPost::factory()->create(['blog_category_id' => $news->id, 'title' => ['en' => 'Brand launch story']]);
        BlogPost::factory()->create(['title' => ['en' => 'Another topic']]);
        BlogPost::factory()->draft()->create();
        BlogPost::factory()->scheduled()->create();

        $this->getJson('/api/v1/blog')->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('meta.total', 2);
        $this->getJson('/api/v1/blog?category=news')->assertJsonCount(1, 'data')->assertJsonPath('data.0.category.slug', 'news');
        $this->getJson('/api/v1/blog?search=launch')->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/blog?per_page=500')->assertUnprocessable();
    }

    public function test_blog_detail_returns_related_posts(): void
    {
        $post = BlogPost::factory()->create(['slug' => 'main']);
        BlogPost::factory()->count(2)->create();

        $this->getJson('/api/v1/blog/main')
            ->assertOk()
            ->assertJsonPath('data.slug', $post->slug)
            ->assertJsonCount(2, 'related');
    }

    public function test_jobs_exclude_closed_and_inactive_postings(): void
    {
        JobPosting::factory()->create(['slug' => 'designer']);
        JobPosting::factory()->closed()->create();
        JobPosting::factory()->create(['is_active' => false]);

        $this->getJson('/api/v1/jobs')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.slug', 'designer');
        $this->getJson('/api/v1/jobs/designer')->assertOk()->assertJsonCount(2, 'data.responsibilities');
    }

    public function test_home_page_returns_ordered_sections_and_hides_empty_ones(): void
    {
        $this->seed([SettingsSeeder::class, ContentSeeder::class]);
        Service::factory()->count(3)->create();

        $types = collect($this->getJson('/api/v1/pages/home')->assertOk()->json('sections'))->pluck('type');

        $this->assertSame('hero', $types->first());
        $this->assertContains('services', $types);
        $this->assertContains('why_meta', $types);
        $this->assertNotContains('projects', $types);
        $this->assertNotContains('testimonials', $types);
        $this->assertNotContains('blog', $types);
    }

    public function test_every_public_listing_endpoint_responds(): void
    {
        foreach (['clients', 'testimonials', 'team', 'highlights', 'faqs', 'redirects', 'projects', 'blog/categories'] as $endpoint) {
            $this->getJson("/api/v1/$endpoint")->assertOk()->assertJsonStructure(['data']);
        }
    }
}
