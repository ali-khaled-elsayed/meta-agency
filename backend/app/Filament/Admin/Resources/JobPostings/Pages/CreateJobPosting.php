<?php

namespace App\Filament\Admin\Resources\JobPostings\Pages;

use App\Filament\Admin\Resources\JobPostings\JobPostingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateJobPosting extends CreateRecord
{
    protected static string $resource = JobPostingResource::class;
}
