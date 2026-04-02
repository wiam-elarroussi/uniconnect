<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\PostLikersPreview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavedPostController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $posts = $user->savedPosts()
            ->with(['user', 'channel', 'comments.user'])
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

        return Inertia::render('SavedPosts/Index', [
            'posts' => $posts,
            'university' => optional($user->university)->name ?? 'Université',
        ]);
    }
}
