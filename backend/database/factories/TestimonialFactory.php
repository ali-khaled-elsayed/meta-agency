<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    public function definition(): array
    {
        return [
            'quote' => ['en' => $this->faker->paragraph()],
            'author_name' => $this->faker->name(),
            'author_position' => ['en' => $this->faker->jobTitle()],
            'company' => $this->faker->company(),
            'is_active' => true,
        ];
    }
}
