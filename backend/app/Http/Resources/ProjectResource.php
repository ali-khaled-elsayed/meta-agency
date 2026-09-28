<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProjectResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'excerpt' => $this->t('excerpt'),
            'year' => $this->year,
            'image' => $this->media($this->image),
            'video_url' => $this->video_url,
            'is_featured' => $this->is_featured,
            'client' => $this->whenLoaded('client', fn () => $this->client ? [
                'name' => $this->client->name,
                'logo' => $this->media($this->client->logo),
            ] : null),
            'service' => $this->whenLoaded('service', fn () => $this->service ? [
                'slug' => $this->service->slug,
                'title' => $this->service->translate('short_title') ?? $this->service->translate('title'),
            ] : null),
        ];
    }
}
