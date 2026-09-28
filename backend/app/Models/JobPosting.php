<?php

namespace App\Models;

use App\Models\Concerns\HasSeo;
use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A career opening. Named JobPosting because Laravel's queue already owns the `jobs` table.
 */
class JobPosting extends Model
{
    use HasFactory, HasSeo, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    public const EMPLOYMENT_TYPES = [
        'full_time' => 'Full-time',
        'part_time' => 'Part-time',
        'contract' => 'Contract',
        'internship' => 'Internship',
        'freelance' => 'Freelance',
    ];

    public const WORKPLACE_TYPES = [
        'on_site' => 'On-site',
        'hybrid' => 'Hybrid',
        'remote' => 'Remote',
    ];

    /** responsibilities / requirements / benefits: {locale: string[]} */
    protected array $translatable = ['title', 'department', 'location', 'summary', 'responsibilities', 'requirements', 'benefits'];

    protected $fillable = [
        'slug', 'title', 'department', 'location', 'employment_type', 'workplace_type', 'summary',
        'responsibilities', 'requirements', 'benefits', 'is_active', 'published_at', 'closes_at', 'sort_order', 'seo',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'published_at' => 'datetime',
            'closes_at' => 'date',
        ];
    }

    public function revalidationTags(): array
    {
        return ['jobs'];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->active()
            ->where(fn (Builder $q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('closes_at')->orWhereDate('closes_at', '>=', today()));
    }
}
