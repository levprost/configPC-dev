<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserConfiguration extends Model
{
    use HasFactory;
    protected $fillable = ['comment_favorite', 'rating_favorite', 'configuration_id', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function configuration()
    {
        return $this->belongsTo(Configuration::class);
    }
}
