<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UserNotification extends Model
{
    protected $table = 'user_notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'meta',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function notifyUser(int $recipientId, string $type, string $title, ?string $body = null, ?array $meta = null): void
    {
        $senderId = Auth::id();
        if ($senderId && $recipientId === $senderId) {
            return;
        }

        self::query()->create([
            'user_id' => $recipientId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'meta' => $meta,
        ]);
    }

    public static function pruneReadForUser(int $userId): void
    {
        self::query()
            ->where('user_id', $userId)
            ->whereNotNull('read_at')
            ->where('read_at', '<', now()->subDay())
            ->delete();
    }
}
