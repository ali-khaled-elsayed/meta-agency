<?php

namespace App\Filament\Admin\Resources\Clients\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ClientsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('logo')->disk('public')->imageHeight(40)->extraImgAttributes(['style' => 'background:#111;padding:6px;border-radius:6px']),
                TextColumn::make('name')->searchable()->placeholder('Name missing')->sortable(),
                TextColumn::make('category')->badge()->searchable()->toggleable(),
                TextColumn::make('projects_count')->counts('projects')->label('Projects'),
                Columns::featured(),
                Columns::active(),
            ])
            ->filters([
                SelectFilter::make('category')->options(fn () => \App\Models\Client::query()->whereNotNull('category')->distinct()->pluck('category', 'category')->all()),
                TernaryFilter::make('is_active')->label('Published'),
                TernaryFilter::make('is_featured')->label('Featured'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
