<?php

namespace App\Filament\Admin\Resources\Testimonials\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::textarea('quote', $locale, $default, 5),
                        Fields::text('author_position', $locale)->label('Position'),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Author')->schema([
                        TextInput::make('author_name')->required()->maxLength(120),
                        TextInput::make('company')->maxLength(150),
                        Select::make('client_id')->relationship('client', 'name')->searchable()->preload()
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->name ?: "Client #{$record->id}"),
                        Fields::image('avatar', 'testimonials', 'Photo'),
                    ]),
                    Fields::publishing(),
                ]),
            ]),
        ]);
    }
}
