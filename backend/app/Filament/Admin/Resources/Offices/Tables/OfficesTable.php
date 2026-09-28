<?php

namespace App\Filament\Admin\Resources\Offices\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OfficesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::translated('name'),
                TextColumn::make('address.en')->label('Address')->limit(50),
                TextColumn::make('phone'),
                IconColumn::make('is_primary')->label('Main')->boolean(),
                Columns::active(),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
