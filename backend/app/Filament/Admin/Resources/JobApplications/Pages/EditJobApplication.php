<?php

namespace App\Filament\Admin\Resources\JobApplications\Pages;

use App\Filament\Admin\Resources\JobApplications\JobApplicationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditJobApplication extends EditRecord
{
    protected static string $resource = JobApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            JobApplicationResource::downloadCvAction()->label('Download CV')->button(),
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return array_intersect_key($data, array_flip(['status', 'admin_notes']));
    }

    protected function afterFill(): void
    {
        if ($this->record->status === 'new') {
            $this->record->update(['status' => 'reviewing']);
            $this->data['status'] = 'reviewing';
        }
    }
}
