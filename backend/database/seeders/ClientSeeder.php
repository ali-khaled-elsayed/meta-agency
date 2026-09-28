<?php

namespace Database\Seeders;

use App\Models\Client;
use Database\Seeders\Concerns\PublishesSeedAssets;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * Client logos from the live site. Names were not published there and must be added in the admin.
 */
class ClientSeeder extends Seeder
{
    use PublishesSeedAssets;

    public function run(): void
    {
        $files = collect(File::files(database_path('seeders/assets/clients')))
            ->map->getFilename()
            ->sort(SORT_NATURAL)
            ->values();

        foreach ($files as $i => $file) {
            $path = $this->publishAsset("clients/$file");

            Client::query()->firstOrCreate(['logo' => $path], ['sort_order' => $i + 1]);
        }
    }
}
