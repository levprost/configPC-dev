<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    public function store(User $user)
    {
        return $user->role === 'ROLE_MODERATOR' || $user->role === 'ROLE_ADMIN'
            ? Response::allow()
            : Response::deny('You do not have permission to create a post.');
    }
    public function update(User $user, Post $post)
    {
        return $user->id === $post->user_id || $user->role === 'ROLE_MODERATOR' || $user->role === 'ROLE_ADMIN'
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    public function delete(User $user, Post $post)
    {
        return $user->id === $post->user_id || $user->role === 'ROLE_MODERATOR' || $user->role === 'ROLE_ADMIN'
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }
}
