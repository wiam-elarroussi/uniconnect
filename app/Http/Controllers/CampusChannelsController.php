<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Support\PostLikersPreview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CampusChannelsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        abort_if(! $user || ! $user->university_id, 403);

        $channels = Channel::where('university_id', $user->university_id)
            ->withCount('followers')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'created_at']);

        $followedIds = $user->followedChannels()->pluck('channels.id')->all();

        return Inertia::render('Channels/Index', [
            'channels' => $channels,
            'followedChannelIds' => array_map('intval', $followedIds),
        ]);
    }

    public function show(Channel $channel): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if(! $user || ! $user->university_id, 403);
        abort_if($channel->university_id !== $user->university_id, 403);

        $postsQuery = Post::where('university_id', $user->university_id)
            ->where('channel_id', $channel->id)
            ->with(['user', 'channel', 'comments.user'])
            ->withCount(['likes', 'saves', 'comments']);

        $posts = $postsQuery->latest()->get();

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

        return Inertia::render('Channels/Show', [
            'channel' => $channel->only(['id', 'name', 'slug', 'created_at']),
            'posts' => $posts,
            'university' => $user->university ? $user->university->name : 'Étudiant',
        ]);
    }

    public function toggleFollow(Channel $channel): RedirectResponse
    {
        $user = Auth::user();
        abort_if(! $user, 403);
        abort_if($channel->university_id !== $user->university_id, 403);

        if ($user->followedChannels()->where('channels.id', $channel->id)->exists()) {
            $user->followedChannels()->detach($channel->id);
        } else {
            $user->followedChannels()->attach($channel->id);
        }

        return back();
    }
}
