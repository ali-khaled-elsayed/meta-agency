<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;

class ServiceDetailResource extends ServiceResource
{
    public function toArray(Request $request): array
    {
        $process = collect((array) ($this->t('process') ?? []))
            ->filter(fn ($step) => filled($step['title'] ?? null))
            ->map(fn ($step) => ['title' => $step['title'], 'description' => $step['description'] ?? null])
            ->values();

        return [
            ...parent::toArray($request),
            'body' => $this->html('body'),
            'capabilities' => $this->tList('capabilities'),
            'process' => $process,
            'video_url' => $this->video_url,
            'gallery' => Media::urls($this->gallery),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'seo' => $this->seo(),
        ];
    }
}
