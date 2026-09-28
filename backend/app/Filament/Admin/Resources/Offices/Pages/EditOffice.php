<?php

namespace App\Filament\Admin\Resources\Offices\Pages;

use App\Filament\Admin\Resources\Offices\OfficeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOffice extends EditRecord
{
    protected static string $resource = OfficeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
