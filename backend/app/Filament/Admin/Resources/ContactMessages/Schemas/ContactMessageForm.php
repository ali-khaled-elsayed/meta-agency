<?php

namespace App\Filament\Admin\Resources\ContactMessages\Schemas;

use App\Models\ContactMessage;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make('Message')->columnSpan(2)->columns(2)->schema([
                    TextEntry::make('name'),
                    TextEntry::make('email')->copyable()->url(fn (ContactMessage $record) => "mailto:{$record->email}"),
                    TextEntry::make('phone')->placeholder('—')->copyable(),
                    TextEntry::make('company')->placeholder('—'),
                    TextEntry::make('service')->placeholder('—'),
                    TextEntry::make('budget')->placeholder('—'),
                    TextEntry::make('created_at')->label('Received')->dateTime(),
                    TextEntry::make('message')->columnSpanFull(),
                ]),
                Section::make('Follow-up')->columnSpan(1)->schema([
                    Select::make('status')->options(ContactMessage::STATUSES)->required()->native(false),
                    Textarea::make('admin_notes')->label('Internal notes')->rows(8)->maxLength(5000),
                ]),
            ]),
        ]);
    }
}
