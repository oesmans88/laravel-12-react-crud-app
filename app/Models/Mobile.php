<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mobile extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'feature_image',
        'feature_image_original_name',
    ];
}
