<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function readAll(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        abort_if(! $user, 403);

        UserNotification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        abort_if(! $user, 403);

        UserNotification::pruneReadForUser($user->id);

        $rows = UserNotification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        $actorIds = $rows->map(function (UserNotification $n) {
            $m = $n->meta ?? [];

            return $m['actor_id'] ?? $m['sender_id'] ?? null;
        })->filter()->unique()->values();

        $actors = User::whereIn('id', $actorIds)
            ->get(['id', 'name', 'avatar_path', 'avatar_builder'])
            ->keyBy('id');

        $postIds = $rows->map(fn (UserNotification $n) => $n->meta['post_id'] ?? null)
            ->filter()
            ->unique()
            ->values();

        $postThumbs = [];
        if ($postIds->isNotEmpty()) {
            $posts = Post::whereIn('id', $postIds)->with(['postItems.postMedia', 'medias'])->get();
            foreach ($posts as $post) {
                $slides = $post->content_slides;
                $firstMedia = collect($slides)->first(fn ($s) => ($s['type'] ?? '') === 'media');
                $postThumbs[$post->id] = $firstMedia['url'] ?? null;
            }
        }

        $notifications = $rows->map(function (UserNotification $n) use ($actors, $postThumbs) {
            $m = $n->meta ?? [];
            $aid = $m['actor_id'] ?? $m['sender_id'] ?? null;
            $actor = $aid && $actors->has($aid) ? $actors->get($aid) : null;
            $pid = $m['post_id'] ?? null;

            return [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'body' => $n->body,
                'created_at' => $n->created_at?->toIso8601String(),
                'read_at' => $n->read_at?->toIso8601String(),
                'meta' => $m,
                'actor' => $actor ? [
                    'id' => $actor->id,
                    'name' => $actor->name,
                    'avatar_url' => $actor->avatar_url,
                ] : null,
                'post_thumb_url' => $pid && isset($postThumbs[$pid]) ? $postThumbs[$pid] : null,
            ];
        });

        $unreadNotificationsCount = UserNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadNotificationsCount' => $unreadNotificationsCount,
        ]);
    }

    public function destroy(Request $request, UserNotification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()?->id, 403);
        $notification->delete();

        return back();
    }

    public function markRead(Request $request, UserNotification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()?->id, 403);
        if ($notification->read_at === null) {
            $notification->update(['read_at' => now()]);
        }

        return back();
    }
}
