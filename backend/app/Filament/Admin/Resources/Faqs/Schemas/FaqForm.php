<?php

namespace App\Filament\Admin\Resources\Faqs\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columnSpanFull()->schema([
                Fields::localeTabs(fn (string $locale, bool $default) => [
                    Fields::text('question', $locale, $default),
                    Fields::richText('answer', $locale)->required($default),
                ]),
                TextInput::make('category')->maxLength(100)->helperText('Optional grouping, e.g. services, careers.'),
            ]),
            Fields::publishing(),
        ]);
    }
}
