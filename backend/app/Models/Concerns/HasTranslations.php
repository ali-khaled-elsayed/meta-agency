<?php

namespace App\Models\Concerns;

/**
 * Stores translatable attributes as JSON objects keyed by locale, e.g. {"en": "...", "ar": "..."}.
 * Models list their translatable attributes in a `$translatable` property.
 */
trait HasTranslations
{
    public function initializeHasTranslations(): void
    {
        $this->mergeCasts(array_fill_keys($this->translatable ?? [], 'array'));
    }

    public function translate(string $attribute, ?string $locale = null): mixed
    {
        $value = $this->getAttribute($attribute);

        if (! is_array($value)) {
            return $value;
        }

        $locale ??= app()->getLocale();
        $translated = $value[$locale] ?? null;

        if ($this->isBlankTranslation($translated)) {
            $translated = $value[config('app.fallback_locale', 'en')] ?? null;
        }

        return $this->isBlankTranslation($translated) ? null : $translated;
    }

    public function hasTranslation(string $attribute, string $locale): bool
    {
        $value = $this->getAttribute($attribute);

        return is_array($value) && ! $this->isBlankTranslation($value[$locale] ?? null);
    }

    public function getTranslatableAttributes(): array
    {
        return $this->translatable ?? [];
    }

    private function isBlankTranslation(mixed $value): bool
    {
        return $value === null || $value === '' || $value === [];
    }
}
