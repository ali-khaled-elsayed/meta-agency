<?php

namespace App\Models;

use App\Models\Concerns\HasSeo;
use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory, HasSeo, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    /** capabilities: {locale: string[]}, process: {locale: [{title, description}]} */
    protected array $translatable = ['title', 'short_title', 'excerpt', 'body', 'capabilities', 'process'];

    protected $fillable = [
        'slug', 'title', 'short_title', 'excerpt', 'body', 'capabilities', 'process',
        'image', 'video_url', 'gallery', 'seo', 'is_featured', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function revalidationTags(): array
    {
        return ['services', 'home'];
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
