<?php

namespace App\Services;

use App\Mail\JobApplicationReceived;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class JobApplicationService
{
    /** CVs live on the private disk and are only reachable through the authorised admin download. */
    public const DISK = 'local';

    public const DIRECTORY = 'job-applications';

    public function __construct(private readonly SiteSettingsService $settings) {}

    public function submit(array $data, UploadedFile $cv, Request $request): JobApplication
    {
        $job = filled($data['job_slug'] ?? null) ? JobPosting::query()->where('slug', $data['job_slug'])->first() : null;

        $path = $cv->storeAs(
            self::DIRECTORY.'/'.now()->format('Y/m'),
            Str::uuid().'.'.strtolower($cv->extension()),
            self::DISK,
        );

        $application = JobApplication::create([
            ...collect($data)->only([
                'first_name', 'last_name', 'email', 'phone', 'city', 'country', 'portfolio_url',
                'linkedin_url', 'expected_salary', 'available_from', 'english_level', 'source', 'message',
            ])->all(),
            'job_posting_id' => $job?->id,
            'position' => $job?->translate('title', 'en') ?? ($data['position'] ?? null),
            'cv_path' => $path,
            'cv_original_name' => Str::limit(basename($cv->getClientOriginalName()), 180, ''),
            'consent' => true,
            'status' => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        $recipients = $this->settings->notificationEmails();

        if ($recipients) {
            Mail::to($recipients)->queue(new JobApplicationReceived($application));
        }

        return $application;
    }
}
