<?php

namespace App\Filament\Admin\Resources\JobApplications\Pages;

use App\Filament\Admin\Resources\JobApplications\JobApplicationResource;
use Filament\Resources\Pages\ListRecords;

class ListJobApplications extends ListRecords
{
    protected static string $resource = JobApplicationResource::class;
}
