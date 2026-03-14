<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = ['title', 'link', 'category', 'user_id', 'university_id'];

    public function user() { return $this->belongsTo(User::class); }
}
