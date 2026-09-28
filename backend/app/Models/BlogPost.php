<?php

namespace App\Models;

use App\Models\Concerns\HasSeo;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    use HasFactory, HasSeo, HasTranslations, RevalidatesFrontend;

    public const STATUSES = ['draft' => 'Draft', 'published' => 'Published'];

    protected array $translatable = ['title', 'excerpt', 'body'];

    protected $fillable = [
        'slug', 'blog_category_id', 'author_name', 'title', 'excerpt', 'body',
        'cover_image', 'reading_minutes', 'status', 'published_at', 'is_featured', 'seo',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'reading_minutes' => 'integer',
        ];
    }

    public function revalidationTags(): array
    {
        return ['blog', 'home'];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
