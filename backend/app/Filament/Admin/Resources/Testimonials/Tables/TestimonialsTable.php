<?php

namespace App\Filament\Admin\Resources\Testimonials\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class TestimonialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::image('avatar')->circular(),
                TextColumn::make('author_name')->searchable()->sortable(),
                TextColumn::make('company')->searchable()->toggleable(),
                Columns::translated('quote'),
                Columns::active(),
            ])
            ->filters([TernaryFilter::make('is_active')->label('Published')])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
