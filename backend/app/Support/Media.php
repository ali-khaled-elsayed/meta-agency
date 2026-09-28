<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media
{
    public const DISK = 'public';

    public static function url(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return Storage::disk(self::DISK)->url($path);
    }

    /**
     * @param  array<int, string>|null  $paths
     * @return array<int, string>
     */
    public static function urls(?array $paths): array
    {
        return array_values(array_filter(array_map(self::url(...), $paths ?? [])));
    }
}
