<?php

namespace App\Filament\Admin\Resources\Pages\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::text('eyebrow', $locale)->helperText('Small label above the headline.'),
                        Fields::text('title', $locale, $default)->label('Headline'),
                        Fields::textarea('intro', $locale, rows: 3),
                        Fields::richText('body', $locale),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Page')->schema([
                        TextInput::make('slug')->required()->alphaDash()->maxLength(100)
                            ->unique('pages', 'slug', ignoreRecord: true)
                            ->disabledOn('edit')
                            ->helperText('Matches the website route, e.g. about, contact.'),
                        Toggle::make('is_active')->label('Published')->default(true),
                    ]),
                    Section::make('Hero media')->schema([
                        Fields::image('hero_image', 'pages', 'Hero image'),
                        Fields::videoUrl('hero_video_url'),
                    ]),
                ]),
            ]),
            Fields::seo('pages/seo'),
        ]);
    }
}
