<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class FaqResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'question' => $this->t('question'),
            'answer' => $this->html('answer'),
        ];
    }
}
