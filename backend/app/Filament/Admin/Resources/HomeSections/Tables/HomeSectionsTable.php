<?php

namespace App\Filament\Admin\Resources\HomeSections\Tables;

use App\Models\HomeSection;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class HomeSectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->description('Drag rows to reorder the homepage. Sections with no published content are hidden automatically.')
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->paginated(false)
            ->columns([
                TextColumn::make('sort_order')->label('#'),
                TextColumn::make('type')->badge()->formatStateUsing(fn (string $state) => HomeSection::TYPES[$state] ?? $state),
                TextColumn::make('title.en')->label('Title')->placeholder('—')->limit(60),
                ToggleColumn::make('is_enabled')->label('Visible'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
