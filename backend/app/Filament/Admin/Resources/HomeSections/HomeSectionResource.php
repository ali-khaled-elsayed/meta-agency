<?php

namespace App\Filament\Admin\Resources\HomeSections;

use App\Filament\Admin\Resources\HomeSections\Pages\CreateHomeSection;
use App\Filament\Admin\Resources\HomeSections\Pages\EditHomeSection;
use App\Filament\Admin\Resources\HomeSections\Pages\ListHomeSections;
use App\Filament\Admin\Resources\HomeSections\Schemas\HomeSectionForm;
use App\Filament\Admin\Resources\HomeSections\Tables\HomeSectionsTable;
use App\Models\HomeSection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HomeSectionResource extends Resource
{
    protected static ?string $model = HomeSection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHome;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Homepage builder';

    public static function form(Schema $schema): Schema
    {
        return HomeSectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HomeSectionsTable::configure($table);
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
            'index' => ListHomeSections::route('/'),
            'create' => CreateHomeSection::route('/create'),
            'edit' => EditHomeSection::route('/{record}/edit'),
        ];
    }
}
