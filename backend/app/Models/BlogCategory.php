<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogCategory extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['name'];

    protected $fillable = ['slug', 'name', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['blog'];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(BlogPost::class);
    }
}
