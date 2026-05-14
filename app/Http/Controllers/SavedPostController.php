<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\UserNotification;
use App\Support\PostLikersPreview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavedPostController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['last_seen_at' => now()]);
        abort_if($user->is_banned, 403, 'Compte suspendu.');

        $universityId = $user->university_id;

        $posts = $user->savedPosts()
            ->with(['user', 'channel', 'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user'])])
            ->withCount(['likes', 'saves', 'comments'])
            ->latest()
            ->get();

        PostLikersPreview::attach($posts);

        $postIds = $posts->pluck('id')->all();
        $likedPostIds = Post::whereIn('id', $postIds)
            ->whereHas('likes', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('id')
            ->all();

        $posts->each(function ($post) use ($likedPostIds, $postIds) {
            $post->liked_by_me = in_array($post->id, $likedPostIds, true);
            $post->saved_by_me = in_array($post->id, $postIds, true);
        });

        $channels = Channel::where('university_id', $universityId)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'avatar_path']);

        UserNotification::pruneReadForUser($user->id);

        return Inertia::render('SavedPosts/Index', [
            'posts' => $posts,
            'university' => optional($user->university)->name ?? 'UniversitÃ©',
            'channels' => $channels,
            'notifications' => [],
        ]);
    }
}

