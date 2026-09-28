<?php

namespace App\Filament\Admin\Resources\Redirects\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RedirectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make('from_path')->required()->maxLength(255)->unique('redirects', 'from_path', ignoreRecord: true)
                    ->regex('/^\/[^\s]*$/')->placeholder('/old-page')->helperText('Old path without domain or locale.'),
                TextInput::make('to_path')->required()->maxLength(255)->placeholder('/new-page')
                    ->helperText('New path (the visitor keeps their language) or a full URL.'),
                Select::make('status_code')->options([301 => '301 — permanent', 302 => '302 — temporary'])->default(301)->required(),
                Toggle::make('is_active')->label('Active')->default(true),
            ]),
        ]);
    }
}
