<?php

namespace App\Filament\Admin\Resources\Projects\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::image(),
                Columns::translated('title'),
                TextColumn::make('client.name')->label('Client')->placeholder('—')->toggleable(),
                TextColumn::make('service.slug')->label('Service')->badge()->toggleable(),
                TextColumn::make('year')->sortable(),
                Columns::featured(),
                Columns::active(),
                Columns::updatedAt(),
            ])
            ->filters([
                SelectFilter::make('service_id')->label('Service')->relationship('service', 'slug')
                    ->getOptionLabelFromRecordUsing(fn ($record) => $record->translate('title', 'en') ?? $record->slug),
                SelectFilter::make('client_id')->label('Client')->relationship('client', 'name')
                    ->getOptionLabelFromRecordUsing(fn ($record) => $record->name ?: "Client #{$record->id}"),
                TernaryFilter::make('is_active')->label('Published'),
                TernaryFilter::make('is_featured')->label('Featured'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
