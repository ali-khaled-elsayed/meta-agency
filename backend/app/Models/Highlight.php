<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Short title + description items grouped by where they appear (e.g. "Why Meta", career benefits).
 */
class Highlight extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    public const GROUPS = [
        'why_meta' => 'Why Meta',
        'values' => 'Values / our way',
        'career_benefits' => 'Career benefits',
        'career_culture' => 'Career culture',
    ];

    protected array $translatable = ['title', 'description'];

    protected $fillable = ['group', 'title', 'description', 'icon', 'image', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['highlights', 'home'];
    }

    public function scopeInGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }
}
