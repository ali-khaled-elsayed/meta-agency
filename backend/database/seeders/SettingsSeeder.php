<?php

namespace Database\Seeders;

use App\Models\Office;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Statistic;
use Database\Seeders\Concerns\PublishesSeedAssets;
use Illuminate\Database\Seeder;

/**
 * Real Meta Egypt details taken from https://meta-egypt-agency.com (see docs/WEBSITE_AUDIT.md §5.1).
 * Existing values are never overwritten so admin edits survive re-seeding.
 */
class SettingsSeeder extends Seeder
{
    use PublishesSeedAssets;

    public function run(): void
    {
        $settings = [
            'site_name' => ['en' => 'Meta Egypt Agency'],
            'tagline' => ['en' => 'A 360 agency covering everything and anything marketing and advertising.'],
            'description' => ['en' => 'Meta Egypt Agency is a 360 marketing agency in Egypt: branding, digital marketing, web & mobile development, content, photography, social media, SEO and PR.'],
            'mission' => ['en' => 'We help businesses grow by delivering smart, results-driven marketing solutions that connect, engage, and convert.'],
            'vision' => ['en' => 'To empower brands through bold strategies, creative storytelling, and digital innovation that drives lasting impact.'],
            'footer_cta' => ['en' => 'Interested in working together?'],
            'working_hours' => ['en' => 'Sat–Tue: 9 AM to 5 PM · Fri: Closed'],
            'contact_email' => 'info@meta-egypt-agency.com',
            'contact_phone' => '+201016566743',
            'whatsapp_number' => '+201016566743',
            'notification_emails' => [],
            'contact_service_options' => ['en' => ['Social Media Services', 'Web/App Development', 'Advertising Services']],
            'budget_options' => ['en' => []],
            'job_source_options' => ['en' => ['Instagram', 'LinkedIn', 'Glassdoor / Indeed', 'Meta Egypt website', 'Other']],
            'english_levels' => ['en' => ['Native', 'Bilingual', 'Professional', 'Limited', 'Elementary']],
            'job_form_fields' => [
                'city' => 'optional',
                'country' => 'optional',
                'portfolio_url' => 'optional',
                'linkedin_url' => 'optional',
                'expected_salary' => 'optional',
                'available_from' => 'optional',
                'english_level' => 'optional',
                'source' => 'optional',
                'message' => 'optional',
            ],
            'logo' => $this->publishAsset('brand/meta-agency-logo.png'),
            'logo_light' => $this->publishAsset('brand/meta-agency-logo-light.png'),
            'logo_icon' => $this->publishAsset('brand/meta-agency-icon.png'),
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }

        $stats = [
            [13, 'Years of Experience'],
            [25, 'Projects Worldwide'],
            [93, 'Clients Worldwide'],
        ];

        foreach ($stats as $i => [$value, $label]) {
            Statistic::query()->firstOrCreate(
                ['label->en' => $label],
                ['value' => $value, 'suffix' => '+', 'label' => ['en' => $label], 'sort_order' => $i + 1],
            );
        }

        $offices = [
            ['Fifth Settlement', 'Egypt, Cairo, Fifth Settlement', true],
            ['Zayed', 'Egypt, Cairo, Zayed', false],
        ];

        foreach ($offices as $i => [$name, $address, $primary]) {
            Office::query()->firstOrCreate(['name->en' => $name], [
                'name' => ['en' => $name],
                'address' => ['en' => $address],
                'phone' => '+201016566743',
                'email' => 'info@meta-egypt-agency.com',
                'hours' => $primary ? ['en' => 'Sat–Tue: 9 AM to 5 PM · Fri: Closed'] : null,
                'is_primary' => $primary,
                'sort_order' => $i + 1,
            ]);
        }

        $socials = [
            'facebook' => 'https://www.facebook.com/share/19Dbfsc6BV/',
            'instagram' => 'https://www.instagram.com/metaegyagency',
            'linkedin' => 'https://www.linkedin.com/company/metaa-agency/',
        ];

        foreach (array_keys($socials) as $i => $platform) {
            SocialLink::query()->firstOrCreate(['platform' => $platform], ['url' => $socials[$platform], 'sort_order' => $i + 1]);
        }
    }
}
