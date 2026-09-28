<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD; nothing is created when they are missing.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (blank($email) || blank($password)) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.');

            return;
        }

        $user = User::query()->firstOrNew(['email' => $email]);
        $user->name = $user->name ?: 'Meta Egypt Admin';

        if (! $user->exists) {
            $user->password = $password;
        }

        $user->is_admin = true;
        $user->save();
    }
}
