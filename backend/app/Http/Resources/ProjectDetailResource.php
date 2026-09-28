<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;

class ProjectDetailResource extends ProjectResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'body' => $this->html('body'),
            'gallery' => Media::urls($this->gallery),
            'seo' => $this->seo(),
        ];
    }
}
