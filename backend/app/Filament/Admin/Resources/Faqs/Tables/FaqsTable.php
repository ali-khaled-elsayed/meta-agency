<?php

namespace App\Filament\Admin\Resources\Faqs\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class FaqsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::translated('question'),
                TextColumn::make('category')->badge()->searchable()->placeholder('—'),
                Columns::active(),
            ])
            ->filters([TernaryFilter::make('is_active')->label('Published')])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
