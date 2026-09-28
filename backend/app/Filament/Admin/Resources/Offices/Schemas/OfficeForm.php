<?php

namespace App\Filament\Admin\Resources\Offices\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OfficeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::text('name', $locale, $default),
                        Fields::textarea('address', $locale, $default, 2),
                        Fields::text('hours', $locale)->label('Opening hours'),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Contact')->schema([
                        TextInput::make('phone')->tel()->maxLength(30),
                        TextInput::make('email')->email()->maxLength(190),
                        TextInput::make('map_url')->label('Google Maps link')->url()->maxLength(500),
                    ]),
                    Section::make('Visibility')->schema([
                        Toggle::make('is_primary')->label('Main office'),
                        Toggle::make('is_active')->label('Published')->default(true),
                        TextInput::make('sort_order')->numeric()->default(0),
                    ]),
                ]),
            ]),
        ]);
    }
}
