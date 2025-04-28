<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Component extends Model
{
    use HasFactory, Searchable;
    protected $fillable = ['name_component', 'subtitle_component', 'price_component', 'description_component', 
    'consumption_component', 'review_component', 'image_component',
     'video_component', 'release_date_component', 'type_component', 'category_id', 'brand_id'];	

    protected $searchable = [
        'name_component',
        'price_component',
        'brand.name_brand',
        'category.name_category'
    ];
    
     public function brand(){
        return $this->belongsTo(Brand::class);
     }
     public function category(){
        return $this->belongsTo(Category::class);
     }
     public function configurations()
    {
        return $this->belongsToMany(Configuration::class, 'configuration_component','configuration_id', 'component_id');
    }
}
