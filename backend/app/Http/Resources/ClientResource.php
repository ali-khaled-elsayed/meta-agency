<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ClientResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logo' => $this->media($this->logo),
            'website_url' => $this->website_url,
            'category' => $this->category,
            'is_featured' => $this->is_featured,
        ];
    }
}
