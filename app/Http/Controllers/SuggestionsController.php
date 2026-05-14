<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SuggestionsController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if(! $user || ! $user->university_id, 403);

        $followingIds = $user->following()->pluck('users.id')->all();

        $suggestions = User::query()
            ->where(function ($q) use ($user) {
                $q->where('university_id', $user->university_id)
                  ->orWhere('role', 'super_admin');
            })
            ->where('id', '!=', $user->id)
            ->whereNotIn('id', $followingIds)
            ->withCount('posts')
            ->orderByDesc('last_seen_at')
            ->limit(48)
            ->get(['id', 'name', 'avatar_path', 'avatar_builder', 'campus_role', 'role', 'last_seen_at']);

        return Inertia::render('Suggestions/Index', [
            'suggestions' => $suggestions,
        ]);
    }
}
