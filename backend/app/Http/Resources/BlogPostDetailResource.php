<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BlogPostDetailResource extends BlogPostResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'body' => $this->html('body'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'seo' => $this->seo(),
        ];
    }
}
