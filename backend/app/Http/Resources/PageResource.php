<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class PageResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'eyebrow' => $this->t('eyebrow'),
            'intro' => $this->t('intro'),
            'body' => $this->html('body'),
            'hero_image' => $this->media($this->hero_image),
            'hero_video_url' => $this->media($this->hero_video) ?? $this->hero_video_url,
            'updated_at' => $this->updated_at?->toIso8601String(),
            'seo' => $this->seo(),
        ];
    }
}
