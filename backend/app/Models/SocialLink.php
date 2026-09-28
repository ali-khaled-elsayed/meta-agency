<?php

namespace App\Models;

use App\Models\Concerns\HasSortableActiveScopes;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    use HasFactory, HasSortableActiveScopes, RevalidatesFrontend;

    public const PLATFORMS = [
        'facebook' => 'Facebook',
        'instagram' => 'Instagram',
        'linkedin' => 'LinkedIn',
        'x' => 'X / Twitter',
        'youtube' => 'YouTube',
        'tiktok' => 'TikTok',
        'behance' => 'Behance',
        'whatsapp' => 'WhatsApp',
    ];

    protected $fillable = ['platform', 'url', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function revalidationTags(): array
    {
        return ['settings'];
    }
}
