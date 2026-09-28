<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class TeamMemberResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->t('name'),
            'position' => $this->t('position'),
            'bio' => $this->t('bio'),
            'photo' => $this->media($this->photo),
            'linkedin_url' => $this->linkedin_url,
        ];
    }
}
