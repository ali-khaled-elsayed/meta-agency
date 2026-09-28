<?php

namespace App\Filament\Admin\Resources\SocialLinks\Tables;

use App\Filament\Support\Columns;
use App\Models\SocialLink;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SocialLinksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('platform')->badge()->formatStateUsing(fn (string $state) => SocialLink::PLATFORMS[$state] ?? $state),
                TextColumn::make('url')->limit(60)->url(fn ($state) => $state, true),
                Columns::active(),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
