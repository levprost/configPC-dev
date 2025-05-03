<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Comment extends Model
{
    use HasFactory, AuthorizesRequests;
    protected $fillable = ['content_comment', 'post_id', 'user_id'];

    public function post(){
        return $this->belongsTo(Post::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
