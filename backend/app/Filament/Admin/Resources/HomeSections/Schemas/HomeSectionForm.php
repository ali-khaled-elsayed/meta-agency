<?php

namespace App\Filament\Admin\Resources\HomeSections\Schemas;

use App\Filament\Support\Fields;
use App\Models\Client;
use App\Models\HomeSection;
use App\Models\Project;
use App\Models\Service;
use App\Models\Testimonial;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class HomeSectionForm
{
    /** Section types whose items can be hand-picked. */
    private const PICKABLE = ['services', 'projects', 'testimonials', 'client_marquee'];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale) => [
                        Fields::text('eyebrow', $locale),
                        Fields::text('title', $locale),
                        Fields::textarea('description', $locale, rows: 3),
                        Fields::text('settings.cta.label', $locale)->label('Primary button label'),
                        Fields::text('settings.secondary_cta.label', $locale)->label('Secondary button label')
                            ->visible(fn (Get $get) => $get('type') === 'hero'),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Section')->schema([
                        Select::make('type')->options(HomeSection::TYPES)->required()->native(false)->live()->disabledOn('edit'),
                        Toggle::make('is_enabled')->label('Visible on homepage')->default(true),
                        TextInput::make('sort_order')->numeric()->default(0),
                    ]),
                    Section::make('Buttons')->schema([
                        TextInput::make('settings.cta.url')->label('Primary button link')->placeholder('/contact')->maxLength(255),
                        TextInput::make('settings.secondary_cta.url')->label('Secondary button link')->placeholder('/our-services')->maxLength(255)
                            ->visible(fn (Get $get) => $get('type') === 'hero'),
                    ]),
                    Section::make('Media')
                        ->visible(fn (Get $get) => in_array($get('type'), ['hero', 'introduction', 'cta'], true))
                        ->schema([
                            Fields::image('image', 'home'),
                            Fields::videoUrl(),
                        ]),
                ]),
            ]),
            Section::make('Items')
                ->description('Leave empty to show all published items automatically, in their saved order.')
                ->visible(fn (Get $get) => in_array($get('type'), self::PICKABLE, true))
                ->columnSpanFull()
                ->columns(2)
                ->schema([
                    Select::make('settings.item_ids')
                        ->label('Selected items (in display order)')
                        ->multiple()
                        ->searchable()
                        ->options(fn (Get $get) => self::itemOptions($get('type'))),
                    TextInput::make('settings.limit')->label('Maximum items')->numeric()->minValue(1)->maxValue(24),
                ]),
        ]);
    }

    /**
     * @return array<int, string>
     */
    private static function itemOptions(?string $type): array
    {
        return match ($type) {
            'services' => Service::query()->ordered()->get()->mapWithKeys(fn ($s) => [$s->id => $s->translate('title', 'en') ?? $s->slug])->all(),
            'projects' => Project::query()->ordered()->get()->mapWithKeys(fn ($p) => [$p->id => $p->translate('title', 'en') ?? $p->slug])->all(),
            'testimonials' => Testimonial::query()->ordered()->get()->mapWithKeys(fn ($t) => [$t->id => $t->author_name])->all(),
            'client_marquee' => Client::query()->ordered()->get()->mapWithKeys(fn ($c) => [$c->id => $c->name ?: "Client #{$c->id}"])->all(),
            default => [],
        };
    }
}
