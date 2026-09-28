<?php

namespace App\Filament\Admin\Resources\Services\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ServicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('sort_order')->label('#')->sortable(),
                Columns::image(),
                Columns::translated('title'),
                TextColumn::make('slug')->searchable()->toggleable(),
                TextColumn::make('projects_count')->counts('projects')->label('Projects')->sortable(),
                Columns::featured(),
                Columns::active(),
                Columns::updatedAt(),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Published'),
                TernaryFilter::make('is_featured')->label('Featured'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
