<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

/**
 * Seeds only verified Meta Egypt content. Safe to re-run: nothing existing is overwritten or deleted.
 */
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
            ServiceSeeder::class,
            ClientSeeder::class,
            ContentSeeder::class,
            BlogSeeder::class,
            CareerSeeder::class,
            ProjectSeeder::class,
        ]);

        Cache::forget('site_settings.all');
    }
}
