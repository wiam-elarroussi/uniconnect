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

        $isSuperAdminProfile = $user->role === 'super_admin';
        if (! $isSuperAdminProfile && $auth->university_id !== $user->university_id) {
            abort(404);
        }

        $postsQuery = Post::where('user_id', $user->id);
        if ($isSuperAdminProfile) {
            // super admin posts have university_id = null
        } else {
            $postsQuery->where('university_id', $user->university_id);
        }
        $posts = $postsQuery
            ->with(['user', 'channel', 'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user'])])
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
        $followersList = $user->followers()
            ->where('users.university_id', $user->university_id)
            ->orderBy('users.name')
            ->get(['users.id', 'users.name', 'users.avatar_path', 'users.avatar_builder']);
        $followingList = $user->following()
            ->where('users.university_id', $user->university_id)
            ->orderBy('users.name')
            ->get(['users.id', 'users.name', 'users.avatar_path', 'users.avatar_builder']);

        return Inertia::render('Profile/Public', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'bio' => $user->bio,
                'email' => $user->email,
                'avatar_path' => $user->avatar_path,
                'avatar_url' => $user->avatar_url,
                'avatar_builder' => $user->avatar_builder,
                'posts_count' => $posts->count(),
                'campus_role' => $user->campus_role ?? 'student',
                'role' => $user->role,
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->following()->count(),
            ],
            'university' => $user->university?->name ?? 'UniversitÃ©',
            'posts' => $posts,
            'isFollowing' => $isFollowing,
            'isSelf' => $auth->id === $user->id,
            'followersList' => $followersList,
            'followingList' => $followingList,
        ]);
    }
}

