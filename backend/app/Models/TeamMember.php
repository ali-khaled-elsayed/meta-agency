<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['name', 'position', 'bio'];

    protected $fillable = ['name', 'position', 'bio', 'photo', 'linkedin_url', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['team'];
    }
}
