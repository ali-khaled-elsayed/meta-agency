<?php

namespace Database\Factories;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    public function definition(): array
    {
        $title = Str::title($this->faker->unique()->jobTitle());

        return [
            'slug' => Str::slug($title),
            'title' => ['en' => $title],
            'department' => ['en' => 'Creative'],
            'location' => ['en' => 'Cairo, Egypt'],
            'employment_type' => 'full_time',
            'workplace_type' => 'on_site',
            'summary' => ['en' => $this->faker->sentence(15)],
            'responsibilities' => ['en' => [$this->faker->sentence(), $this->faker->sentence()]],
            'requirements' => ['en' => [$this->faker->sentence()]],
            'is_active' => true,
            'published_at' => now()->subDay(),
        ];
    }

    public function closed(): static
    {
        return $this->state(['closes_at' => now()->subDay()]);
    }
}
