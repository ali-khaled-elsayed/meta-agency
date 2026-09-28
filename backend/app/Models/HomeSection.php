<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasTranslations, RevalidatesFrontend;

    public const TYPES = [
        'hero' => 'Hero',
        'client_marquee' => 'Client marquee',
        'introduction' => 'Introduction',
        'statistics' => 'Statistics',
        'services' => 'Services',
        'projects' => 'Featured work',
        'why_meta' => 'Why Meta',
        'testimonials' => 'Testimonials',
        'blog' => 'Blog',
        'cta' => 'Call to action',
    ];

    protected array $translatable = ['eyebrow', 'title', 'description'];

    protected $fillable = ['type', 'is_enabled', 'sort_order', 'eyebrow', 'title', 'description', 'image', 'video_url', 'settings'];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'settings' => 'array',
        ];
    }

    public function revalidationTags(): array
    {
        return ['home'];
    }

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true)->orderBy('sort_order')->orderBy('id');
    }

    public function setting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }
}
