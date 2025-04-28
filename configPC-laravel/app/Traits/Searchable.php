<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

trait Searchable {
    public function scopeSearch(Builder $builder, string $term = '') {
        foreach ($this->searchable as $searchable) {
            if (str_contains($searchable, '.')) { 
                $relation = Str::beforeLast($searchable, '.');
                $column = Str::afterLast($searchable, '.');


                if (method_exists($this, $relation)) {
                    $builder->orWhereHas($relation, function ($query) use ($column, $term) {
                        $query->where($column, 'like', "%$term%");
                    });
                }
                continue;
            }

            if (in_array($searchable, $this->fillable)) {
                $builder->orWhere($searchable, 'like', "%$term%");
            }
        }
    }
}
