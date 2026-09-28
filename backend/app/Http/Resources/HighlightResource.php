<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class HighlightResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group' => $this->group,
            'title' => $this->t('title'),
            'description' => $this->t('description'),
            'icon' => $this->icon,
            'image' => $this->media($this->image),
        ];
    }
}
