<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Support\PostLikersPreview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    public function show(Request $request, User $user): Response
    {
        $auth = Auth::user();
        abort_if(! $auth, 403);
        abort_if($auth->university_id !== $user->university_id, 404);

        $posts = Post::where('user_id', $user->id)
            ->where('university_id', $user->university_id)
            ->with(['user', 'channel', 'comments.user'])
            ->withCount(['likes', 'saves', 'comments'])
            ->latest()
            ->get();

        $postIds = $posts->pluck('id')->values();
        $likedPostIds = Post::whereIn('id', $postIds)
            ->whereHas('likes', fn ($q) => $q->where('user_id', $auth->id))
            ->pluck('id')
            ->values()
            ->all();

        $savedPostIds = Post::whereIn('id', $postIds)
            ->whereHas('saves', fn ($q) => $q->where('user_id', $auth->id))
            ->pluck('id')
            ->values()
            ->all();

        $posts->each(function ($post) use ($likedPostIds, $savedPostIds) {
            $post->liked_by_me = in_array($post->id, $likedPostIds, true);
            $post->saved_by_me = in_array($post->id, $savedPostIds, true);
        });

        PostLikersPreview::attach($posts);

        $isFollowing = $auth->following()->where('users.id', $user->id)->exists();

        return Inertia::render('Profile/Public', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_path' => $user->avatar_path,
                'avatar_url' => $user->avatar_url,
                'avatar_builder' => $user->avatar_builder,
                'karma' => $user->karma,
                'campus_role' => $user->campus_role ?? 'student',
                'role' => $user->role,
            ],
            'university' => $user->university?->name ?? 'Université',
            'posts' => $posts,
            'isFollowing' => $isFollowing,
            'isSelf' => $auth->id === $user->id,
        ]);
    }
}
