<?php

namespace App\Filament\Admin\Resources\BlogCategories\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class BlogCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::translated('name'),
                TextColumn::make('slug')->searchable(),
                TextColumn::make('posts_count')->counts('posts')->label('Posts')->sortable(),
                Columns::active(),
            ])
            ->filters([TernaryFilter::make('is_active')->label('Published')])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
