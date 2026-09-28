<?php

namespace App\Filament\Admin\Resources\SocialLinks\Schemas;

use App\Models\SocialLink;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SocialLinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                Select::make('platform')->options(SocialLink::PLATFORMS)->required()->native(false),
                TextInput::make('url')->label('URL')->url()->required()->maxLength(500),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->label('Published')->default(true),
            ]),
        ]);
    }
}
