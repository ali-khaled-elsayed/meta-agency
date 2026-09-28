<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['label'];

    protected $fillable = ['value', 'prefix', 'suffix', 'label', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['value' => 'integer', 'is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['settings', 'home'];
    }
}
