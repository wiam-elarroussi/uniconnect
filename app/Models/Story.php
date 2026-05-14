<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    protected $fillable = ['user_id', 'university_id', 'body', 'media_path', 'expires_at'];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected $appends = ['media_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function views()
    {
        return $this->hasMany(StoryView::class);
    }

    public function getMediaUrlAttribute(): ?string
    {
        if (empty($this->media_path)) {
            return null;
        }

        return '/storage/'.$this->media_path;
    }
}
