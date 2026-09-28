<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogCategory>
 */
class BlogCategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = Str::title($this->faker->unique()->word());

        return ['slug' => Str::slug($name), 'name' => ['en' => $name], 'is_active' => true];
    }
}
