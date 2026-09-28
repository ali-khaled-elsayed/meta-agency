<?php

namespace App\Filament\Admin\Resources\JobPostings\Pages;

use App\Filament\Admin\Resources\JobPostings\JobPostingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListJobPostings extends ListRecords
{
    protected static string $resource = JobPostingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
