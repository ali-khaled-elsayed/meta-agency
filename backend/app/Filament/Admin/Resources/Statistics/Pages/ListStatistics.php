<?php

namespace App\Filament\Admin\Resources\Statistics\Pages;

use App\Filament\Admin\Resources\Statistics\StatisticResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListStatistics extends ListRecords
{
    protected static string $resource = StatisticResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
