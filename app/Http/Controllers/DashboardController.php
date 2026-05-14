<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\Resource;
use App\Models\Story;
use App\Models\User;
use App\Models\UserNotification;
use App\Support\PostLikersPreview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['last_seen_at' => now()]);
        abort_if($user->is_banned, 403, 'Compte suspendu.');

        $universityId = $user->university_id;
        $feedMode = $request->query('feed', 'all') === 'following' ? 'following' : 'all';
        $channelFeed = $request->query('channels') === 'followed' ? 'followed' : 'all';
        $followedChannelIds = $user->followedChannels()->pluck('channels.id')->all();

        $followingIds = $user->following()->pluck('users.id')->all();

        $postsQuery = Post::where(function ($q) use ($universityId) {
                $q->where('university_id', $universityId)
                  ->orWhereHas('user', fn ($q2) => $q2->where('role', 'super_admin'));
            })
            ->where('user_id', '!=', $user->id)
            ->with(['user', 'channel', 'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user'])])
            ->withCount(['likes', 'saves', 'comments']);

        if ($feedMode === 'following') {
            $allowedUserIds = array_values(array_unique(array_merge([$user->id], $followingIds)));
            $postsQuery->whereIn('user_id', $allowedUserIds);
        }

        if ($channelFeed === 'followed') {
            $postsQuery->where(function ($q) use ($followedChannelIds) {
                $q->whereNull('channel_id');
                if (count($followedChannelIds) > 0) {
                    $q->orWhereIn('channel_id', $followedChannelIds);
                }
            });
        }

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

        UserNotification::pruneReadForUser($user->id);

        $since = now()->subDays(14);
        $tagCounts = [];
        Post::where('university_id', $universityId)
            ->where('created_at', '>=', $since)
            ->whereNotNull('body')
            ->pluck('body')
            ->each(function ($body) use (&$tagCounts) {
                if (preg_match_all('/#([\p{L}0-9_]+)/u', (string) $body, $m)) {
                    foreach ($m[1] as $tag) {
                        $key = mb_strtolower($tag, 'UTF-8');
                        $tagCounts[$key] = ($tagCounts[$key] ?? 0) + 1;
                    }
                }
            });

        arsort($tagCounts);
        $trending = collect($tagCounts)
            ->take(8)
            ->map(fn ($count, $tag) => ['tag' => '#'.$tag, 'posts' => $count])
            ->values()
            ->all();

        $onlineUsers = User::query()
            ->where('university_id', $universityId)
            ->where('id', '!=', $user->id)
            ->where('last_seen_at', '>=', now()->subMinutes(15))
            ->orderByDesc('last_seen_at')
            ->limit(12)
            ->get(['id', 'name', 'avatar_path', 'avatar_builder']);

        $suggestionQuery = User::query()
            ->where(function ($q) use ($universityId) {
                $q->where('university_id', $universityId)
                  ->orWhere('role', 'super_admin');
            })
            ->where('id', '!=', $user->id)
            ->whereNotIn('id', $followingIds);

        $followSuggestions = $suggestionQuery
            ->orderByDesc('last_seen_at')
            ->limit(8)
            ->get(['id', 'name', 'avatar_path', 'avatar_builder', 'role', 'campus_role']);

        $storiesQuery = Story::with('user:id,name,avatar_path,avatar_builder')
            ->withCount('views')
            ->where(function ($q) use ($universityId) {
                $q->where('university_id', $universityId)
                  ->orWhereHas('user', fn ($q2) => $q2->where('role', 'super_admin'));
            })
            ->where('expires_at', '>', now());

        if ($feedMode === 'following') {
            $storyUserIds = array_values(array_unique(array_merge([$user->id], $followingIds)));
            $storiesQuery->whereIn('user_id', $storyUserIds);
        }

        $stories = $storiesQuery->latest()->get();

        $channels = Channel::where('university_id', $universityId)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'avatar_path']);

        $myPostsCount = Post::where('university_id', $universityId)
            ->where('user_id', $user->id)
            ->count();

        return Inertia::render('Dashboard', [
            'university' => $user->university ? $user->university->name : 'Étudiant',
            'role' => $user->role,
            'posts' => $posts,
            'resources' => Resource::where('university_id', $universityId)->with('user')->latest()->get(),
            'stories' => $stories,
            'notifications' => [],
            'feedMode' => $feedMode,
            'channelFeed' => $channelFeed,
            'followedChannelIds' => array_map('intval', $followedChannelIds),
            'followingIds' => array_map('intval', $followingIds),
            'trending' => $trending,
            'onlineUsers' => $onlineUsers,
            'followSuggestions' => $followSuggestions,
            'channels' => $channels,
            'myPostsCount' => $myPostsCount,
        ]);
    }
}
