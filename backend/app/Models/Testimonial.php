<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory, HasSortableActiveScopes, HasTranslations, RevalidatesFrontend;

    protected array $translatable = ['quote', 'author_position'];

    protected $fillable = ['quote', 'author_name', 'author_position', 'company', 'avatar', 'client_id', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['testimonials', 'home'];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
