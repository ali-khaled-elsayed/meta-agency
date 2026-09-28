<?php

namespace App\Models;

use App\Models\Concerns\HasSeo;
use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory, HasSeo, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['title', 'excerpt', 'body'];

    protected $fillable = [
        'slug', 'title', 'client_id', 'service_id', 'year', 'excerpt', 'body',
        'image', 'video_url', 'gallery', 'seo', 'is_featured', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'gallery' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function revalidationTags(): array
    {
        return ['projects', 'services', 'home'];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
