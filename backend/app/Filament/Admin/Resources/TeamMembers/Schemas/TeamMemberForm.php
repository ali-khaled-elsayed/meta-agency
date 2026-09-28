<?php

namespace App\Filament\Admin\Resources\TeamMembers\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TeamMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::text('name', $locale, $default),
                        Fields::text('position', $locale),
                        Fields::textarea('bio', $locale, rows: 3),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Profile')->schema([
                        Fields::image('photo', 'team'),
                        TextInput::make('linkedin_url')->label('LinkedIn URL')->url()->maxLength(255),
                    ]),
                    Fields::publishing(),
                ]),
            ]),
        ]);
    }
}
