<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class OfficeResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->t('name'),
            'address' => $this->t('address'),
            'phone' => $this->phone,
            'email' => $this->email,
            'map_url' => $this->map_url,
            'hours' => $this->t('hours'),
            'is_primary' => $this->is_primary,
        ];
    }
}
