<?php

namespace App\Filament\Admin\Resources\Highlights\Tables;

use App\Filament\Support\Columns;
use App\Models\Highlight;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class HighlightsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('group')->badge()->formatStateUsing(fn (string $state) => Highlight::GROUPS[$state] ?? $state),
                Columns::translated('title'),
                Columns::translated('description'),
                Columns::active(),
            ])
            ->filters([SelectFilter::make('group')->options(Highlight::GROUPS)])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
