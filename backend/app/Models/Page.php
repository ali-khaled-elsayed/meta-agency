<?php

namespace App\Models;

use App\Models\Concerns\HasSeo;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory, HasSeo, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['title', 'eyebrow', 'intro', 'body'];

    protected $fillable = ['slug', 'title', 'eyebrow', 'intro', 'body', 'hero_image', 'hero_video_url', 'seo', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
