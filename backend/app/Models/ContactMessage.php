<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    public const STATUSES = [
        'new' => 'New',
        'read' => 'Read',
        'replied' => 'Replied',
        'archived' => 'Archived',
    ];

    protected $fillable = [
        'name', 'email', 'phone', 'company', 'service', 'budget', 'message',
        'status', 'admin_notes', 'ip_address', 'user_agent',
    ];

    protected $hidden = ['ip_address', 'user_agent', 'admin_notes'];
}
