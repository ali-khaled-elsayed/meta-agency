<?php

namespace App\Filament\Admin\Resources\Services\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::titleWithSlug($locale, $default),
                        Fields::text('short_title', $locale)->helperText('Short name used in menus and lists.'),
                        Fields::textarea('excerpt', $locale, $default, 3),
                        Fields::richText('body', $locale),
                        TagsInput::make("capabilities.$locale")->label('Capabilities')->placeholder('Add a capability and press Enter'),
                        Repeater::make("process.$locale")
                            ->label('Process steps')
                            ->schema([
                                TextInput::make('title')->required()->maxLength(120),
                                Textarea::make('description')->rows(2)->maxLength(500),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->defaultItems(0)
                            ->itemLabel(fn (array $state) => $state['title'] ?? null),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('URL')->schema([Fields::slug('services')]),
                    Section::make('Media')->schema([
                        Fields::image('image', 'services'),
                        Fields::videoUrl(),
                    ]),
                    Fields::publishing()->schema([
                        Toggle::make('is_active')->label('Published')->default(true),
                        Toggle::make('is_featured')->label('Featured on homepage'),
                        TextInput::make('sort_order')->numeric()->default(0)->minValue(0),
                    ]),
                ]),
            ]),
            Section::make('Gallery')->collapsed()->columnSpanFull()->schema([Fields::gallery('services/gallery')]),
            Fields::seo('services/seo'),
        ]);
    }
}
