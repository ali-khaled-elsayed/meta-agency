<?php

namespace App\Filament\Admin\Resources\Highlights\Schemas;

use App\Filament\Support\Fields;
use App\Models\Highlight;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HighlightForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::text('title', $locale, $default),
                        Fields::textarea('description', $locale, rows: 3),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Placement')->schema([
                        Select::make('group')->options(Highlight::GROUPS)->required()->native(false),
                        TextInput::make('icon')->maxLength(60)->helperText('Optional icon keyword.'),
                        Fields::image('image', 'highlights'),
                    ]),
                    Fields::publishing(),
                ]),
            ]),
        ]);
    }
}
