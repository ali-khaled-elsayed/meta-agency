<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = Str::title($this->faker->unique()->words(3, true));

        return [
            'slug' => Str::slug($title),
            'title' => ['en' => $title],
            'client_id' => Client::factory(),
            'service_id' => Service::factory(),
            'year' => (int) $this->faker->year(),
            'excerpt' => ['en' => $this->faker->sentence()],
            'body' => ['en' => '<p>'.$this->faker->paragraph().'</p>'],
            'is_active' => true,
            'is_featured' => true,
        ];
    }
}
