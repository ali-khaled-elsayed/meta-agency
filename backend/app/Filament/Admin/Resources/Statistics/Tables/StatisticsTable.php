<?php

namespace App\Filament\Admin\Resources\Statistics\Tables;

use App\Filament\Support\Columns;
use App\Models\Statistic;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StatisticsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('value')->formatStateUsing(fn (Statistic $record) => "{$record->prefix}{$record->value}{$record->suffix}")->weight('bold'),
                Columns::translated('label'),
                Columns::active(),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
