<?php

namespace App\Filament\Admin\Resources\ContactMessages\Tables;

use App\Models\ContactMessage;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

class ContactMessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->searchable()->weight('bold'),
                TextColumn::make('email')->searchable()->copyable(),
                TextColumn::make('service')->placeholder('—')->toggleable(),
                TextColumn::make('message')->limit(60)->searchable()->toggleable(),
                TextColumn::make('status')->badge()
                    ->formatStateUsing(fn (string $state) => ContactMessage::STATUSES[$state] ?? $state)
                    ->color(fn (string $state) => match ($state) {
                        'new' => 'info',
                        'replied' => 'success',
                        'archived' => 'gray',
                        default => 'warning',
                    }),
                TextColumn::make('created_at')->label('Received')->since()->sortable(),
            ])
            ->filters([SelectFilter::make('status')->options(ContactMessage::STATUSES)])
            ->recordActions([EditAction::make()->label('Open'), DeleteAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('markRead')->label('Mark as read')->icon('heroicon-o-check')
                        ->action(fn (Collection $records) => $records->each->update(['status' => 'read']))
                        ->deselectRecordsAfterCompletion(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
