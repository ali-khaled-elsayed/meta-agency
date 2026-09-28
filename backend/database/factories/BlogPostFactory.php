<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogPost>
 */
class BlogPostFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(5);

        return [
            'slug' => Str::slug($title),
            'blog_category_id' => BlogCategory::factory(),
            'author_name' => $this->faker->name(),
            'title' => ['en' => $title],
            'excerpt' => ['en' => $this->faker->sentence(20)],
            'body' => ['en' => '<p>'.$this->faker->paragraph().'</p>'],
            'status' => 'published',
            'published_at' => now()->subDays($this->faker->numberBetween(1, 60)),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }

    public function scheduled(): static
    {
        return $this->state(['published_at' => now()->addWeek()]);
    }
}
