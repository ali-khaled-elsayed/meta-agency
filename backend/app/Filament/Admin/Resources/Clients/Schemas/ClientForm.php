<?php

namespace App\Filament\Admin\Resources\Clients\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make('name')->maxLength(150)->helperText('Also used as the logo alt text.'),
                TextInput::make('category')->maxLength(100)->helperText('Optional, e.g. Real estate. Used for filtering.'),
                TextInput::make('website_url')->url()->maxLength(255),
                TextInput::make('sort_order')->numeric()->default(0)->minValue(0),
                Fields::image('logo', 'clients')->required()->imageEditor(false)
                    ->helperText('Transparent PNG or WebP, light logo on transparent background works best.'),
                Section::make()->schema([
                    Toggle::make('is_active')->label('Published')->default(true),
                    Toggle::make('is_featured')->label('Featured'),
                ]),
            ]),
        ]);
    }
}
