<?php

namespace App\Filament\Support;

use App\Support\Media;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Illuminate\Database\Eloquent\Builder;

class Columns
{
    /**
     * Shows the English value of a translatable JSON attribute and makes it searchable.
     */
    public static function translated(string $attribute, ?string $label = null): TextColumn
    {
        return TextColumn::make("$attribute.en")
            ->label($label ?? str($attribute)->headline()->toString())
            ->searchable(query: fn (Builder $query, string $search) => $query->where(function (Builder $q) use ($attribute, $search) {
                $term = '%'.addcslashes($search, '%_\\').'%';
                $q->where("$attribute->en", 'like', $term)->orWhere("$attribute->ar", 'like', $term);
            }))
            ->limit(60)
            ->wrap();
    }

    public static function image(string $name = 'image'): ImageColumn
    {
        return ImageColumn::make($name)->disk(Media::DISK)->square()->imageHeight(48);
    }

    public static function active(): ToggleColumn
    {
        return ToggleColumn::make('is_active')->label('Published');
    }

    public static function featured(): ToggleColumn
    {
        return ToggleColumn::make('is_featured')->label('Featured');
    }

    public static function updatedAt(): TextColumn
    {
        return TextColumn::make('updated_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true);
    }
}
