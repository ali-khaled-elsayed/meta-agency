<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class TestimonialResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote' => $this->t('quote'),
            'author_name' => $this->author_name,
            'author_position' => $this->t('author_position'),
            'company' => $this->company,
            'avatar' => $this->media($this->avatar),
        ];
    }
}
