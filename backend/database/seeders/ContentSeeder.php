<?php

namespace Database\Seeders;

use App\Models\Highlight;
use App\Models\HomeSection;
use App\Models\Page;
use App\Models\Redirect;
use Illuminate\Database\Seeder;

/**
 * Page shells, homepage sections and legacy redirects. Copy is taken from the live site where it was real;
 * headings are short editorial lines that the team can change in the admin.
 */
class ContentSeeder extends Seeder
{
    private const WHO_WE_ARE = "Experience makes the difference. With pride in our team's experience and professionalism, and in the number of clients who trust us, we continue our efforts to inspire those around us with our vision. We believe that radical change stems from the infrastructure, so we start by understanding the nucleus of your project.";

    public function run(): void
    {
        $this->pages();
        $this->highlights();
        $this->homeSections();
        $this->redirects();
    }

    private function pages(): void
    {
        $pages = [
            'home' => ['Meta Egypt Agency', null, 'A 360 agency covering everything and anything marketing and advertising, swinging branches and building brands.'],
            'about' => ['Experience makes the difference.', 'Who we are', self::WHO_WE_ARE],
            'our-services' => ['Everything marketing. One team.', 'Our services', 'From strategic branding to public relations — eleven disciplines working together to connect, engage and convert.'],
            'projects' => ['Selected work.', 'Projects', null],
            'our-clients' => ['Brands that trust us.', 'Our clients', null],
            'blog' => ['News & insights.', 'Blog', null],
            'career' => ['Build your career with us.', 'Career', "We're always looking for creative, talented self-starters to join our family."],
            'job-apply' => ['Apply to join Meta.', 'Job application', null],
            'contact' => ["Let's create something great.", 'Contact', 'Tell us about your project and our team will get back to you.'],
            'privacy-policy' => ['Privacy Policy', 'Legal', null],
        ];

        foreach ($pages as $slug => [$title, $eyebrow, $intro]) {
            Page::query()->firstOrCreate(['slug' => $slug], [
                'title' => ['en' => $title],
                'eyebrow' => $eyebrow ? ['en' => $eyebrow] : null,
                'intro' => $intro ? ['en' => $intro] : null,
                'body' => $slug === 'privacy-policy'
                    ? ['en' => file_get_contents(database_path('seeders/content/privacy-policy.en.html'))]
                    : null,
            ]);
        }
    }

    private function highlights(): void
    {
        $items = [
            ['Strategy', 'We help businesses grow by delivering smart, results-driven marketing solutions that connect, engage, and convert.'],
            ['Creativity', 'We empower brands through bold strategies, creative storytelling, and digital innovation that drives lasting impact.'],
            ['Expertise', 'The real estate industry demands a unique and tailored approach to marketing. We provide comprehensive media marketing solutions designed to elevate your business to new heights.'],
            ['Execution', 'Our team of experienced professionals understands property trends and buyer behaviour, and turns that insight into marketing strategies that resonate with your audience.'],
        ];

        foreach ($items as $i => [$title, $description]) {
            Highlight::query()->firstOrCreate(['group' => 'why_meta', 'title->en' => $title], [
                'title' => ['en' => $title],
                'description' => ['en' => $description],
                'sort_order' => $i + 1,
            ]);
        }
    }

    private function homeSections(): void
    {
        if (HomeSection::query()->exists()) {
            return;
        }

        $sections = [
            ['hero', [
                'eyebrow' => ['en' => 'Meta Egypt Agency — 360 marketing & advertising'],
                'title' => ['en' => 'Building brands that connect, engage & convert.'],
                'description' => ['en' => 'A 360 agency covering everything and anything marketing and advertising, swinging branches and building brands.'],
                'settings' => [
                    'cta' => ['label' => ['en' => 'Start a project', 'ar' => 'ابدأ مشروعك'], 'url' => '/contact'],
                    'secondary_cta' => ['label' => ['en' => 'Our services', 'ar' => 'خدماتنا'], 'url' => '/our-services'],
                ],
            ]],
            ['introduction', [
                'eyebrow' => ['en' => 'Who we are'],
                'title' => ['en' => 'A 360 agency, swinging branches and building brands.'],
                'description' => ['en' => self::WHO_WE_ARE],
                'settings' => ['cta' => ['label' => ['en' => 'About Meta', 'ar' => 'عن ميتا'], 'url' => '/about']],
            ]],
            ['projects', ['eyebrow' => ['en' => 'Our work', 'ar' => 'أعمالنا'], 'title' => ['en' => 'Latest work', 'ar' => 'أحدث أعمالنا']]],
            ['services', [
                'eyebrow' => ['en' => 'What we do'],
                'title' => ['en' => 'Eleven disciplines. One team.'],
                'settings' => ['cta' => ['label' => ['en' => 'All services', 'ar' => 'كل الخدمات'], 'url' => '/our-services']],
            ]],
            ['client_marquee', ['title' => ['en' => 'Trusted by brands across Egypt and beyond']]],
            ['why_meta', ['eyebrow' => ['en' => 'Why Meta'], 'title' => ['en' => 'Strategy, creativity, expertise, execution.']]],
            ['statistics', ['eyebrow' => ['en' => 'In numbers']]],
            ['testimonials', ['eyebrow' => ['en' => 'Client stories'], 'title' => ['en' => 'What our clients say']]],
            ['blog', ['eyebrow' => ['en' => 'Insights'], 'title' => ['en' => 'News & insights'], 'settings' => ['limit' => 8]]],
            ['cta', [
                'eyebrow' => ['en' => "Let's build together"],
                'title' => ['en' => 'Interested in working together?'],
                'settings' => ['cta' => ['label' => ['en' => 'Get in touch', 'ar' => 'تواصل معنا'], 'url' => '/contact']],
            ]],
        ];

        foreach ($sections as $i => [$type, $data]) {
            HomeSection::query()->create(['type' => $type, 'sort_order' => $i + 1, ...$data]);
        }
    }

    private function redirects(): void
    {
        $redirects = [
            '/career/career-details' => '/career',
            '/career-details' => '/career',
            '/our-projects' => '/projects',
            '/projects/market-analysis' => '/projects',
            '/our-team' => '/about',
            '/teams' => '/about',
            '/teams/marvin-mckinney' => '/about',
            '/pricing' => '/contact',
            '/blog-grid' => '/blog',
            '/blog-left-sidebar' => '/blog',
            '/blog-right-sidebar' => '/blog',
            '/services' => '/our-services',
            '/services/strategic-planning' => '/our-services',
        ];

        foreach ($redirects as $from => $to) {
            Redirect::query()->firstOrCreate(['from_path' => $from], ['to_path' => $to, 'status_code' => 301]);
        }
    }
}
