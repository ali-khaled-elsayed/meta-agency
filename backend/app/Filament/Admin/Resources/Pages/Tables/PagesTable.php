<?php

namespace App\Filament\Admin\Resources\Pages\Tables;

use App\Filament\Support\Columns;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('slug')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable()->badge(),
                Columns::translated('title', 'Headline'),
                TextColumn::make('seo.title.en')->label('Meta title')->placeholder('Default')->toggleable(),
                Columns::active(),
                Columns::updatedAt(),
            ])
            ->filters([TernaryFilter::make('is_active')->label('Published')])
            ->recordActions([EditAction::make()]);
    }
}
