<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $interdit = ['mot1', 'mot2', 'insulte']; // Tu pourras compléter la liste

        foreach ($interdit as $mot) {
            if (str_contains(strtolower($request->body), $mot)) {
                return back()->withErrors(['body' => 'Votre message contient un mot non autorisé par la charte de SupMTI.']);
            }
        }

        $request->validate([
            'body' => 'nullable|string|max:1000|required_without:media',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov|max:15360|required_without:body',
            'channel_id' => 'nullable|integer|exists:channels,id',
        ]);

        $mediaPath = null;
        if ($request->hasFile('media')) {
            $mediaPath = $request->file('media')->store('posts', 'public');
        }

        $uid = Auth::user()->university_id;
        $channelId = null;
        if ($request->filled('channel_id')) {
            $channel = Channel::where('id', $request->integer('channel_id'))->where('university_id', $uid)->first();
            abort_if(! $channel, 403);
            $channelId = $channel->id;
        }

        $body = $request->input('body');
        if ($body === null || $body === '') {
            $body = '';
        }

        Post::create([
            'body' => $body,
            'media_path' => $mediaPath,
            'user_id' => Auth::id(),
            'university_id' => $uid,
            'channel_id' => $channelId,
        ]);

        Auth::user()?->incrementKarma(1);

        return back()->with('success', 'Publication publiée.');
    }

    public function destroy(Post $post)
    {
        // Sécurité : Seul l'auteur peut supprimer son post
        if (Auth::id() !== $post->user_id) {
            abort(403);
        }

        if ($post->media_path) {
            Storage::disk('public')->delete($post->media_path);
        }

        $post->delete();

        return back();
    }

    public function toggleLike(Request $request, Post $post)
    {
        $user = Auth::user();
        if (! $user) {
            abort(403);
        }

        // Empêche de liker un post d'une autre université
        if ($post->university_id !== $user->university_id) {
            abort(403);
        }

        if ($post->likes()->where('user_id', $user->id)->exists()) {
            $post->likes()->detach($user->id);
        } else {
            $post->likes()->attach($user->id);
            if ($post->user_id !== $user->id) {
                UserNotification::notifyUser(
                    $post->user_id,
                    'like',
                    'Nouveau j\'aime',
                    $user->name.' a aimé votre publication.',
                    ['post_id' => $post->id]
                );
            }
        }

        return back();
    }

    public function toggleSave(Request $request, Post $post)
    {
        $user = Auth::user();
        if (! $user) {
            abort(403);
        }

        if ($post->university_id !== $user->university_id) {
            abort(403);
        }

        if ($post->saves()->where('user_id', $user->id)->exists()) {
            $post->saves()->detach($user->id);
        } else {
            $post->saves()->attach($user->id);
        }

        return back();
    }

    public function storeComment(Request $request, Post $post)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        if (! $user) {
            abort(403);
        }

        if ($post->university_id !== $user->university_id) {
            abort(403);
        }

        PostComment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'body' => $request->body,
        ]);

        $user->incrementKarma(1);

        if ($post->user_id !== $user->id) {
            UserNotification::notifyUser(
                $post->user_id,
                'comment',
                'Nouveau commentaire',
                $user->name.' a commenté votre publication.',
                ['post_id' => $post->id]
            );
        }

        return back();
    }
}
