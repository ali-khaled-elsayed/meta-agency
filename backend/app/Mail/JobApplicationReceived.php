<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public JobApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New job application: '.($this->application->position ?: 'General application').' — '.$this->application->full_name,
            replyTo: [new Address($this->application->email, $this->application->full_name)],
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.job-application-received');
    }
}
