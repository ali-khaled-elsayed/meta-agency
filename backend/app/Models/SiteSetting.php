<?php

namespace App\Models;

use App\Jobs\RevalidateFrontend;
use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use RevalidatesFrontend;

    private const CACHE_KEY = 'site_settings.all';

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    public function revalidationTags(): array
    {
        return ['settings'];
    }

    /**
     * @return array<string, mixed>
     */
    public static function allValues(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => static::query()->pluck('value', 'key')->all());
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::allValues()[$key] ?? $default;
    }

    public static function put(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * Saves many settings with a single cache flush and frontend revalidation.
     *
     * @param  array<string, mixed>  $values
     */
    public static function putMany(array $values): void
    {
        static::withoutEvents(function () use ($values) {
            foreach ($values as $key => $value) {
                static::put($key, $value);
            }
        });

        Cache::forget(self::CACHE_KEY);
        RevalidateFrontend::dispatch(['settings']);
    }
}
