<?php

namespace App\Filament\Admin\Resources\HomeSections\Pages;

use App\Filament\Admin\Resources\HomeSections\HomeSectionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHomeSection extends EditRecord
{
    protected static string $resource = HomeSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
