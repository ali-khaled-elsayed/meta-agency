<?php

namespace App\Services;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ContactMessageService
{
    public function __construct(private readonly SiteSettingsService $settings) {}

    public function submit(array $data, Request $request): ContactMessage
    {
        $message = ContactMessage::create([
            ...collect($data)->only(['name', 'email', 'phone', 'company', 'service', 'budget', 'message'])->all(),
            'status' => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        $recipients = $this->settings->notificationEmails();

        if ($recipients) {
            Mail::to($recipients)->queue(new ContactMessageReceived($message));
        }

        return $message;
    }
}
