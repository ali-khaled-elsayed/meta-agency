<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ServiceResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'short_title' => $this->t('short_title') ?? $this->t('title'),
            'excerpt' => $this->t('excerpt'),
            'image' => $this->media($this->image),
            'is_featured' => $this->is_featured,
            'order' => $this->sort_order,
        ];
    }
}
