<?php

namespace App\Filament\Admin\Resources\Projects\Schemas;

use App\Filament\Support\Fields;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::titleWithSlug($locale, $default),
                        Fields::textarea('excerpt', $locale, rows: 3),
                        Fields::richText('body', $locale),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Details')->schema([
                        Fields::slug('projects'),
                        Select::make('client_id')->relationship('client', 'name')->searchable()->preload()
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->name ?: "Client #{$record->id}"),
                        Select::make('service_id')->label('Service / category')->relationship('service', 'slug')->searchable()->preload()
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->translate('title', 'en') ?? $record->slug),
                        TextInput::make('year')->numeric()->minValue(2000)->maxValue(2100),
                    ]),
                    Section::make('Media')->schema([
                        Fields::image('image', 'projects', 'Cover image'),
                        Fields::videoUrl(),
                    ]),
                    Section::make('Visibility')->schema([
                        Toggle::make('is_active')->label('Published')->default(true),
                        Toggle::make('is_featured')->label('Featured on homepage'),
                        TextInput::make('sort_order')->numeric()->default(0)->minValue(0),
                    ]),
                ]),
            ]),
            Section::make('Gallery')->collapsed()->columnSpanFull()->schema([Fields::gallery('projects/gallery')]),
            Fields::seo('projects/seo'),
        ]);
    }
}
