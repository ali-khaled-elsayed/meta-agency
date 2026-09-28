<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    use HasFactory;

    public const STATUSES = [
        'new' => 'New',
        'reviewing' => 'Reviewing',
        'shortlisted' => 'Shortlisted',
        'interview' => 'Interview',
        'rejected' => 'Rejected',
        'hired' => 'Hired',
    ];

    protected $fillable = [
        'job_posting_id', 'position', 'first_name', 'last_name', 'email', 'phone', 'city', 'country',
        'cv_path', 'cv_original_name', 'portfolio_url', 'linkedin_url', 'expected_salary', 'available_from',
        'english_level', 'source', 'message', 'consent', 'status', 'admin_notes', 'ip_address', 'user_agent',
    ];

    protected $hidden = ['cv_path', 'ip_address', 'user_agent', 'admin_notes'];

    protected function casts(): array
    {
        return [
            'available_from' => 'date',
            'consent' => 'boolean',
        ];
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
