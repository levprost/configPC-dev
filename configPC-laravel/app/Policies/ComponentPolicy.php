<?php

namespace App\Policies;

use App\Models\Component;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ComponentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Component $component): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['IS_ADMIN', 'IS_MODERATOR']);
    }

    public function update(User $user, Component $component): bool
    {
        return in_array($user->role, ['IS_ADMIN', 'IS_MODERATOR']);
    }

    public function delete(User $user, Component $component): bool
    {
        return in_array($user->role, ['IS_ADMIN', 'IS_MODERATOR']);
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Component $component): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Component $component): bool
    {
        return false;
    }
}
