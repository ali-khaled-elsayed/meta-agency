<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory, HasSortableActiveScopes, RevalidatesFrontend;

    protected $fillable = ['name', 'logo', 'website_url', 'category', 'is_featured', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_featured' => 'boolean', 'is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['clients', 'home'];
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
