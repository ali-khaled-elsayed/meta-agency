<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BlogPostResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'excerpt' => $this->t('excerpt'),
            'cover_image' => $this->media($this->cover_image),
            'author_name' => $this->author_name,
            'reading_minutes' => $this->reading_minutes,
            'published_at' => $this->published_at?->toIso8601String(),
            'is_featured' => $this->is_featured,
            'category' => $this->whenLoaded('category', fn () => $this->category ? new BlogCategoryResource($this->category) : null),
        ];
    }
}
