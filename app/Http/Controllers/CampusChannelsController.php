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
    public function index(\Illuminate\Http\Request $request): Response
    {
        $user = Auth::user();
        abort_if(! $user || ! $user->university_id, 403);

        $showFollowing = $request->boolean('following');

        $channels = Channel::where('university_id', $user->university_id)
            ->withCount('followers')
            ->with([
                'latestPost' => function ($q) {
                    $q->with(['postItems.postMedia', 'medias']);
                },
            ])
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'description', 'slug', 'created_at', 'avatar_path']);

        $followedIds = $user->followedChannels()->pluck('channels.id')->all();
        $followedSet = array_flip(array_map('intval', $followedIds));

        $channels = $channels->map(function (Channel $c) {
            $post = $c->latestPost;
            $preview = null;
            if ($post) {
                $slides = $post->content_slides ?? [];
                $firstMedia = collect($slides)->first(fn ($s) => ($s['type'] ?? '') === 'media');
                $mediaCount = collect($slides)->filter(fn ($s) => ($s['type'] ?? '') === 'media')->count();
                $preview = [
                    'post_id' => $post->id,
                    'thumb_url' => $firstMedia['url'] ?? null,
                    'is_video' => (bool) ($firstMedia['is_video'] ?? false),
                    'is_multi' => $mediaCount > 1,
                    'has_text_slide' => collect($slides)->contains(fn ($s) => ($s['type'] ?? '') === 'text'),
                ];
            }

            return array_merge($c->only(['id', 'name', 'description', 'slug', 'created_at', 'avatar_path', 'followers_count']), [
                'avatar_url' => $c->avatar_url,
                'preview' => $preview,
            ]);
        });

        if ($showFollowing) {
            $channels = $channels->filter(fn ($c) => isset($followedSet[$c['id']]))->values();
        } else {
            $channels = $channels->sortBy(function ($c) use ($followedSet) {
                $followed = isset($followedSet[$c['id']]);

                return $followed ? 1 : 0;
            })->values();
        }

        return Inertia::render('Channels/Index', [
            'channels' => $channels,
            'followedChannelIds' => array_map('intval', $followedIds),
            'showFollowing' => $showFollowing,
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
            ->with(['user', 'channel', 'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user'])])
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
            'university' => $user->university ? $user->university->name : 'Ã‰tudiant',
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

