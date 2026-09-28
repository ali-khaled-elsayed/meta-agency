<?php

namespace App\Filament\Admin\Resources\BlogCategories\Schemas;

use App\Filament\Support\Fields;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BlogCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columnSpanFull()->schema([
                Fields::localeTabs(fn (string $locale, bool $default) => [
                    Fields::titleWithSlug($locale, $default, 'name'),
                ]),
                Fields::slug('blog_categories'),
            ]),
            Fields::publishing(),
        ]);
    }
}
