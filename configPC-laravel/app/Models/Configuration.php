<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Configuration extends Model
{
    use HasFactory;
    protected $fillable = [
        'name_config',
        'title_config',
        'subtitle_config',
        'description_config',
        'explication_config',
        'image_config',
        'benchmark_config',
        'user_id',
        'is_published_config',
    ];

    public function users()
    {
        return $this->hasMany(UserConfiguration::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // 'user_id' - внешний ключ
    }
    public function components()
    {
        return $this->belongsToMany(Component::class, 'configuration_component','configuration_id', 'component_id');
    }
    public function userConfiguration()
    {
        return $this->hasMany(UserConfiguration::class);
    }
}
