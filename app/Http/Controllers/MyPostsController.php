<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Support\PostLikersPreview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MyPostsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['last_seen_at' => now()]);
        abort_if($user->is_banned, 403, 'Compte suspendu.');

        $universityId = $user->university_id;

        $posts = Post::where('user_id', $user->id)
            ->where('university_id', $universityId)
            ->with(['user', 'channel', 'comments.user'])
            ->withCount(['likes', 'saves', 'comments'])
            ->latest()
            ->get();

        PostLikersPreview::attach($posts);

        $postIds = $posts->pluck('id')->values();
        $likedPostIds = Post::whereIn('id', $postIds)
            ->whereHas('likes', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('id')
            ->values()
            ->all();

        $savedPostIds = Post::whereIn('id', $postIds)
            ->whereHas('saves', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('id')
            ->values()
            ->all();

        $posts->each(function ($post) use ($likedPostIds, $savedPostIds) {
            $post->liked_by_me = in_array($post->id, $likedPostIds, true);
            $post->saved_by_me = in_array($post->id, $savedPostIds, true);
        });

        $channels = Channel::where('university_id', $universityId)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'avatar_path']);

        return Inertia::render('MyPosts/Index', [
            'university' => $user->university ? $user->university->name : 'Étudiant',
            'posts' => $posts,
            'channels' => $channels,
        ]);
    }
}
