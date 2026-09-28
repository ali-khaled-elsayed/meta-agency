<?php

namespace App\Filament\Admin\Resources\ContactMessages\Pages;

use App\Filament\Admin\Resources\ContactMessages\ContactMessageResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditContactMessage extends EditRecord
{
    protected static string $resource = ContactMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('reply')
                ->label('Reply by email')
                ->icon('heroicon-o-paper-airplane')
                ->url(fn () => 'mailto:'.$this->record->email.'?subject='.rawurlencode('Re: your message to Meta Egypt Agency')),
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
            $this->record->update(['status' => 'read']);
            $this->data['status'] = 'read';
        }
    }
}
