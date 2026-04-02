<?php

namespace App\Http\Controllers;

use App\Models\Channel;
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
