<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Post extends Model
{
    use HasFactory, AuthorizesRequests;
    protected $fillable = ['title_post', 'content_post', 'content_post_1', 'content_post_2', 'subtitle_post', 
    'description_post', 'is_published', 'order_post', 'user_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function comments(){
        return $this->hasMany(Comment::class);
    }
    public function media(){
        return $this->hasMany(Media::class);
    }
}
