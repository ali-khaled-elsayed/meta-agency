<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class StatisticResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'prefix' => $this->prefix,
            'suffix' => $this->suffix,
            'label' => $this->t('label'),
        ];
    }
}
