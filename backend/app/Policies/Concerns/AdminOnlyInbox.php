<?php

namespace App\Policies\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Website submissions: admins can read, update status/notes and delete; nobody creates them in the admin.
 */
trait AdminOnlyInbox
{
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, Model $record): bool
    {
        return $user->is_admin;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Model $record): bool
    {
        return $user->is_admin;
    }

    public function delete(User $user, Model $record): bool
    {
        return $user->is_admin;
    }

    public function deleteAny(User $user): bool
    {
        return $user->is_admin;
    }
}
