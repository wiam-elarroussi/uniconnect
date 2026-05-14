<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostItem extends Model
{
    protected $table = 'post_items';

    protected $fillable = [
        'post_id',
        'position',
        'kind',
        'text',
        'post_media_id',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function postMedia(): BelongsTo
    {
        return $this->belongsTo(PostMedia::class, 'post_media_id');
    }
}
