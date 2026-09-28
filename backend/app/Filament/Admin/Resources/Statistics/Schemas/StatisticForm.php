<?php

namespace App\Filament\Admin\Resources\Statistics\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class StatisticForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(3)->columnSpanFull()->schema([
                TextInput::make('prefix')->maxLength(8),
                TextInput::make('value')->numeric()->required()->minValue(0),
                TextInput::make('suffix')->maxLength(8)->default('+'),
                Fields::localeTabs(fn (string $locale, bool $default) => [
                    Fields::text('label', $locale, $default),
                ]),
            ]),
            Fields::publishing(),
        ]);
    }
}
