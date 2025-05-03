<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Media extends Model
{
    use HasFactory, AuthorizesRequests;
    protected $fillable = ['media_file', 'media_type', 'post_id'];

    public function post(){
        return $this->belongsTo(Post::class);
    }

}
