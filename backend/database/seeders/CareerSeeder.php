<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use Illuminate\Database\Seeder;

/**
 * The six openings listed on meta-egypt-agency.com/career, with the details shown in that listing.
 * The live site's shared "career-details" page describes an unrelated role, so it is not used here.
 */
class CareerSeeder extends Seeder
{
    private const SUMMARY = 'Our goal is to work with large and significant projects that will be used by tens or hundreds of thousands of people.';

    public function run(): void
    {
        $jobs = [
            'mechanical-engineering' => 'Mechanical Engineering',
            'civil-engineering' => 'Civil Engineering',
            'construction-worker' => 'Construction Worker',
            'industry-manager' => 'Industry Manager',
            'skyscraper-construction' => 'Skyscraper Construction',
            'global-sales-marketing' => 'Global Sales & Marketing',
        ];

        $order = 0;
        foreach ($jobs as $slug => $title) {
            JobPosting::query()->firstOrCreate(['slug' => $slug], [
                'title' => ['en' => $title],
                'summary' => ['en' => self::SUMMARY],
                'requirements' => ['en' => ['English level - Intermediate']],
                'employment_type' => 'full_time',
                'workplace_type' => 'on_site',
                'is_active' => true,
                'sort_order' => ++$order,
            ]);
        }
    }
}
