<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class JobPostingDetailResource extends JobPostingResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'responsibilities' => $this->tList('responsibilities'),
            'requirements' => $this->tList('requirements'),
            'benefits' => $this->tList('benefits'),
            'seo' => $this->seo(),
        ];
    }
}
