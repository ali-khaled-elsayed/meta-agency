<?php

namespace App\Filament\Admin\Resources\Redirects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class RedirectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('from_path')
            ->columns([
                TextColumn::make('from_path')->searchable()->sortable(),
                TextColumn::make('to_path')->searchable(),
                TextColumn::make('status_code')->badge(),
                ToggleColumn::make('is_active')->label('Active'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
