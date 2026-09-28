<?php

namespace App\Filament\Admin\Resources\Highlights;

use App\Filament\Admin\Resources\Highlights\Pages\CreateHighlight;
use App\Filament\Admin\Resources\Highlights\Pages\EditHighlight;
use App\Filament\Admin\Resources\Highlights\Pages\ListHighlights;
use App\Filament\Admin\Resources\Highlights\Schemas\HighlightForm;
use App\Filament\Admin\Resources\Highlights\Tables\HighlightsTable;
use App\Models\Highlight;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HighlightResource extends Resource
{
    protected static ?string $model = Highlight::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedStar;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 7;

    protected static ?string $navigationLabel = 'Highlights (Why Meta, benefits)';

    public static function form(Schema $schema): Schema
    {
        return HighlightForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HighlightsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHighlights::route('/'),
            'create' => CreateHighlight::route('/create'),
            'edit' => EditHighlight::route('/{record}/edit'),
        ];
    }
}
