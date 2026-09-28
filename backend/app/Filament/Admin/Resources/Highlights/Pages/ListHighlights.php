<?php

namespace App\Filament\Admin\Resources\Highlights\Pages;

use App\Filament\Admin\Resources\Highlights\HighlightResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHighlights extends ListRecords
{
    protected static string $resource = HighlightResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
