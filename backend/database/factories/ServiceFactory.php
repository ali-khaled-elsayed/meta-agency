<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Test/development data only — never used by the production seeders.
 *
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $title = Str::title($this->faker->unique()->words(2, true));

        return [
            'slug' => Str::slug($title),
            'title' => ['en' => $title, 'ar' => null],
            'short_title' => ['en' => $title],
            'excerpt' => ['en' => $this->faker->sentence(18)],
            'body' => ['en' => '<p>'.$this->faker->paragraph().'</p>'],
            'capabilities' => ['en' => $this->faker->words(4)],
            'process' => ['en' => [['title' => 'Discover', 'description' => $this->faker->sentence()]]],
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 50),
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
