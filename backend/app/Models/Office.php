<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['name', 'address', 'hours'];

    protected $fillable = ['name', 'address', 'phone', 'email', 'map_url', 'hours', 'is_primary', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_primary' => 'boolean', 'is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['settings'];
    }
}
