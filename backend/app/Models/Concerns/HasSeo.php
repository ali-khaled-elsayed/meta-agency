<?php

namespace App\Models\Concerns;

use App\Support\Media;

/**
 * Expects a JSON `seo` column shaped like:
 * {"title": {"en": "", "ar": ""}, "description": {"en": "", "ar": ""}, "image": "path", "noindex": false}
 */
trait HasSeo
{
    public function initializeHasSeo(): void
    {
        $this->mergeCasts(['seo' => 'array']);
    }

    public function seoFor(?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $fallback = config('app.fallback_locale', 'en');
        $seo = $this->seo ?? [];

        $pick = fn (string $key) => ($seo[$key][$locale] ?? null) ?: ($seo[$key][$fallback] ?? null);

        return [
            'title' => $pick('title'),
            'description' => $pick('description'),
            'image' => Media::url($seo['image'] ?? null),
            'noindex' => (bool) ($seo['noindex'] ?? false),
        ];
    }
}
