<?php

namespace App\Filament\Admin\Resources\Offices;

use App\Filament\Admin\Resources\Offices\Pages\CreateOffice;
use App\Filament\Admin\Resources\Offices\Pages\EditOffice;
use App\Filament\Admin\Resources\Offices\Pages\ListOffices;
use App\Filament\Admin\Resources\Offices\Schemas\OfficeForm;
use App\Filament\Admin\Resources\Offices\Tables\OfficesTable;
use App\Models\Office;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class OfficeResource extends Resource
{
    protected static ?string $model = Office::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return OfficeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OfficesTable::configure($table);
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
            'index' => ListOffices::route('/'),
            'create' => CreateOffice::route('/create'),
            'edit' => EditOffice::route('/{record}/edit'),
        ];
    }
}
