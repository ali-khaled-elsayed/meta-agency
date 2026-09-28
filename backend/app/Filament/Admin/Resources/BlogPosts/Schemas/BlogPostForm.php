<?php

namespace App\Filament\Admin\Resources\BlogPosts\Schemas;

use App\Filament\Support\Fields;
use App\Models\BlogPost;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::titleWithSlug($locale, $default),
                        Fields::textarea('excerpt', $locale, rows: 3),
                        Fields::richText('body', $locale)->required($default),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Publishing')->schema([
                        Select::make('status')->options(BlogPost::STATUSES)->default('draft')->required()->native(false),
                        DateTimePicker::make('published_at')->default(now())->helperText('Future dates schedule the post.'),
                        Toggle::make('is_featured')->label('Featured'),
                    ]),
                    Section::make('Details')->schema([
                        Fields::slug('blog_posts'),
                        Select::make('blog_category_id')->label('Category')->relationship('category', 'slug')->searchable()->preload()
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->translate('name', 'en') ?? $record->slug),
                        TextInput::make('author_name')->maxLength(120),
                        TextInput::make('reading_minutes')->numeric()->minValue(1)->maxValue(120)->suffix('min'),
                        Fields::image('cover_image', 'blog', 'Cover image'),
                    ]),
                ]),
            ]),
            Fields::seo('blog/seo'),
        ]);
    }
}
