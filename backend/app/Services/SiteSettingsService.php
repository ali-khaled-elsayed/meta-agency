<?php

namespace App\Services;

use App\Http\Resources\OfficeResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\StatisticResource;
use App\Models\BlogPost;
use App\Models\Client;
use App\Models\JobPosting;
use App\Models\Office;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Support\Media;

class SiteSettingsService
{
    /** Settings stored as {locale: value}. */
    public const TRANSLATABLE_KEYS = [
        'site_name', 'tagline', 'description', 'mission', 'vision', 'footer_cta', 'working_hours',
        'contact_service_options', 'budget_options', 'job_source_options', 'english_levels',
    ];

    /** Settings stored as plain values. */
    public const PLAIN_KEYS = [
        'contact_email', 'contact_phone', 'whatsapp_number', 'google_maps_url',
        'logo', 'logo_light', 'logo_icon', 'default_og_image', 'hero_video', 'hero_video_url', 'job_form_fields',
        'theme_toggle',
    ];

    /** Settings never exposed publicly. */
    public const PRIVATE_KEYS = ['notification_emails'];

    public const JOB_FORM_FIELDS = [
        'city', 'country', 'portfolio_url', 'linkedin_url', 'expected_salary',
        'available_from', 'english_level', 'source', 'message',
    ];

    public function publicPayload(): array
    {
        $values = SiteSetting::allValues();
        $locale = app()->getLocale();
        $fallback = config('app.fallback_locale', 'en');

        $translated = collect(self::TRANSLATABLE_KEYS)->mapWithKeys(function (string $key) use ($values, $locale, $fallback) {
            $value = $values[$key] ?? null;

            return [$key => is_array($value) ? (filled($value[$locale] ?? null) ? $value[$locale] : ($value[$fallback] ?? null)) : $value];
        });

        return [
            ...$translated->all(),
            'contact_email' => $values['contact_email'] ?? null,
            'contact_phone' => $values['contact_phone'] ?? null,
            'whatsapp_number' => $values['whatsapp_number'] ?? null,
            'google_maps_url' => $values['google_maps_url'] ?? null,
            'hero_video_url' => Media::url($values['hero_video'] ?? null) ?? ($values['hero_video_url'] ?? null),
            'logo' => Media::url($values['logo'] ?? null),
            'logo_light' => Media::url($values['logo_light'] ?? null),
            'logo_icon' => Media::url($values['logo_icon'] ?? null),
            'default_og_image' => Media::url($values['default_og_image'] ?? null),
            'job_form_fields' => $this->jobFormFields($values['job_form_fields'] ?? []),
            'theme_toggle' => (bool) ($values['theme_toggle'] ?? true),
            'social_links' => SocialLink::query()->active()->ordered()->get(['platform', 'url']),
            'offices' => OfficeResource::collection(Office::query()->active()->ordered()->get()),
            'statistics' => StatisticResource::collection(Statistic::query()->active()->ordered()->get()),
            'services' => ServiceResource::collection(Service::query()->active()->ordered()->get()),
            'features' => [
                'projects' => Project::query()->active()->exists(),
                'blog' => BlogPost::query()->published()->exists(),
                'jobs' => JobPosting::query()->open()->exists(),
                'testimonials' => Testimonial::query()->active()->exists(),
                'team' => TeamMember::query()->active()->exists(),
                'clients' => Client::query()->active()->exists(),
            ],
        ];
    }

    /**
     * Each optional job-application field is "required", "optional" or "hidden".
     *
     * @return array<string, string>
     */
    public function jobFormFields(?array $configured = null): array
    {
        $configured ??= SiteSetting::get('job_form_fields', []);

        return collect(self::JOB_FORM_FIELDS)
            ->mapWithKeys(fn (string $field) => [$field => in_array($configured[$field] ?? null, ['required', 'optional', 'hidden'], true) ? $configured[$field] : 'optional'])
            ->all();
    }

    /**
     * @return array<int, string>
     */
    public function notificationEmails(): array
    {
        $emails = (array) SiteSetting::get('notification_emails', []);
        $emails[] = SiteSetting::get('contact_email');

        return array_values(array_unique(array_filter($emails, fn ($email) => filter_var($email, FILTER_VALIDATE_EMAIL))));
    }

    /**
     * @return array<int, string>
     */
    public function optionValues(string $key): array
    {
        $value = SiteSetting::get($key, []);

        return collect(is_array($value) ? $value : [])->flatten()->filter()->map(fn ($v) => (string) $v)->unique()->values()->all();
    }
}
