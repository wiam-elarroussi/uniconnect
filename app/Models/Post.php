<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['body', 'media_path', 'user_id', 'university_id', 'channel_id'];

    protected $appends = ['media', 'media_url', 'content_slides'];

    /**
     * @var array<int, string>
     */
    protected $hidden = [
        'medias',
        'postItems',
    ];

    /**
     * @var array<int, string>
     */
    protected $with = [
        'medias',
        'postItems.postMedia',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'post_likes')->withTimestamps();
    }

    public function saves()
    {
        return $this->belongsToMany(User::class, 'post_saves')->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(PostComment::class)->latest();
    }

    public function medias()
    {
        return $this->hasMany(PostMedia::class)->orderBy('position');
    }

    public function postItems()
    {
        return $this->hasMany(PostItem::class)->orderBy('position');
    }

    /**
     * Ordre du fil : diapositives texte et média mélangées.
     *
     * @return array<int, array{type: 'text', body: string}|array{type: 'media', url: string, is_video: bool}>
     */
    public function getContentSlidesAttribute(): array
    {
        if (! $this->relationLoaded('postItems')) {
            $this->loadMissing('postItems.postMedia');
        }

        if ($this->postItems->isNotEmpty()) {
            return $this->postItems
                ->sortBy('position')
                ->values()
                ->map(function (PostItem $it) {
                    if ($it->kind === 'text') {
                        return [
                            'type' => 'text',
                            'body' => (string) ($it->text ?? ''),
                        ];
                    }
                    if ($it->kind === 'media' && $it->postMedia) {
                        $m = $it->postMedia;

                        return [
                            'type' => 'media',
                            'url' => $m->url,
                            'is_video' => (bool) $m->is_video,
                        ];
                    }

                    return null;
                })
                ->filter()
                ->values()
                ->all();
        }

        $slides = [];
        if (trim((string) $this->body) !== '') {
            $slides[] = [
                'type' => 'text',
                'body' => (string) $this->body,
            ];
        }
        foreach ($this->medias as $m) {
            $slides[] = [
                'type' => 'media',
                'url' => $m->url,
                'is_video' => (bool) $m->is_video,
            ];
        }

        return $slides;
    }

    /**
     * @return array<int, array{url: string, is_video: bool}>
     */
    public function getMediaAttribute(): array
    {
        if ($this->medias->isNotEmpty()) {
            return $this->medias->map(fn (PostMedia $m) => [
                'url' => $m->url,
                'is_video' => $m->is_video,
            ])->values()->all();
        }

        if ($this->media_path) {
            return [[
                'url' => '/storage/'.$this->media_path,
                'is_video' => (bool) preg_match('/(\.mp4|\.webm|\.mov)(\?|#|$)/i', (string) $this->media_path),
            ]];
        }

        return [];
    }

    public function getMediaUrlAttribute(): ?string
    {
        if ($this->medias->isNotEmpty()) {
            return $this->medias->first()->url;
        }

        return $this->media_path ? '/storage/'.$this->media_path : null;
    }
}
