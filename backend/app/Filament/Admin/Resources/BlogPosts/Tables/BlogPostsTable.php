<?php

namespace App\Filament\Admin\Resources\BlogPosts\Tables;

use App\Filament\Support\Columns;
use App\Models\BlogPost;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class BlogPostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                Columns::image('cover_image'),
                Columns::translated('title'),
                TextColumn::make('category.name.en')->label('Category')->badge()->toggleable(),
                TextColumn::make('status')->badge()
                    ->color(fn (string $state) => $state === 'published' ? 'success' : 'gray')
                    ->formatStateUsing(fn (string $state) => BlogPost::STATUSES[$state] ?? $state),
                TextColumn::make('published_at')->dateTime()->sortable(),
                Columns::featured(),
                Columns::updatedAt(),
            ])
            ->filters([
                SelectFilter::make('status')->options(BlogPost::STATUSES),
                SelectFilter::make('blog_category_id')->label('Category')->relationship('category', 'slug'),
                TernaryFilter::make('is_featured')->label('Featured'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
