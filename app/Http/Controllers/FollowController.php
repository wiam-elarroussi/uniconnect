<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function toggle(User $user): RedirectResponse
    {
        $auth = Auth::user();
        abort_if(! $auth, 403);
        abort_if($auth->id === $user->id, 403);
        abort_if($auth->university_id !== $user->university_id, 403);

        if ($auth->following()->where('users.id', $user->id)->exists()) {
            $auth->following()->detach($user->id);
        } else {
            $auth->following()->attach($user->id);
        }

        return back();
    }
}
