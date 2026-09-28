<?php

namespace App\Filament\Admin\Resources\Statistics\Pages;

use App\Filament\Admin\Resources\Statistics\StatisticResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditStatistic extends EditRecord
{
    protected static string $resource = StatisticResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
