<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMedia extends Model
{
    protected $table = 'post_media';

    protected $fillable = ['post_id', 'path', 'position'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function getUrlAttribute(): string
    {
        return '/storage/'.$this->path;
    }

    public function getIsVideoAttribute(): bool
    {
        return (bool) preg_match('/(\.mp4|\.webm|\.mov)(\?|#|$)/i', (string) $this->path);
    }
}
