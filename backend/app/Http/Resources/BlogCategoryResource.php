<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BlogCategoryResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->t('name'),
            'posts_count' => $this->whenCounted('posts'),
        ];
    }
}
