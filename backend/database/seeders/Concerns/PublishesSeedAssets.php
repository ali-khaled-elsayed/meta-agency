<?php

namespace Database\Seeders\Concerns;

use App\Support\Media;
use Illuminate\Support\Facades\Storage;

trait PublishesSeedAssets
{
    /**
     * Copies a file from database/seeders/assets to the public disk (once) and returns its storage path.
     */
    protected function publishAsset(string $relativePath): string
    {
        $target = 'seed/'.$relativePath;
        $disk = Storage::disk(Media::DISK);

        if (! $disk->exists($target)) {
            $disk->put($target, file_get_contents(database_path('seeders/assets/'.$relativePath)));
        }

        return $target;
    }
}
