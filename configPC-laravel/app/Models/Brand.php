<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;
    protected $fillable = ['name_brand', 'logo_brand', 'description_brand', 'color_brand'];

    public function component(){
        return $this->hasMany(Component::class);
    }

}
