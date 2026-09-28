<?php

namespace App\Http\Resources;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'department' => $this->t('department'),
            'location' => $this->t('location'),
            'employment_type' => $this->employment_type,
            'employment_type_label' => JobPosting::EMPLOYMENT_TYPES[$this->employment_type] ?? $this->employment_type,
            'workplace_type' => $this->workplace_type,
            'workplace_type_label' => JobPosting::WORKPLACE_TYPES[$this->workplace_type] ?? $this->workplace_type,
            'summary' => $this->t('summary'),
            'published_at' => $this->published_at?->toIso8601String(),
            'closes_at' => $this->closes_at?->toDateString(),
        ];
    }
}
