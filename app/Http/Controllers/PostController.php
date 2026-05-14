<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostItem;
use App\Models\User;
use App\Models\UserNotification;
use App\Support\PostLikersPreview;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $interdit = ['mot1', 'mot2', 'insulte']; // Tu pourras compléter la liste

        $authUser = Auth::user();
        $uid = $authUser->university_id;
        $isSuperAdmin = $authUser->role === 'super_admin';

        $channelId = null;
        if ($request->filled('channel_id')) {
            $channelQuery = Channel::where('id', $request->integer('channel_id'));
            if (! $isSuperAdmin) {
                $channelQuery->where('university_id', $uid);
            }
            $channel = $channelQuery->first();
            abort_if(! $channel, 403);
            $channelId = $channel->id;
        }

        $rawItems = $request->input('items');
        if (is_string($rawItems)) {
            $decodedItems = json_decode($rawItems, true);
        } elseif (is_array($rawItems)) {
            $decodedItems = $rawItems;
        } else {
            $decodedItems = [];
        }
        $decodedItems = is_array($decodedItems) ? $decodedItems : [];

        $useBlocks = count($decodedItems) > 0;

        if ($useBlocks) {
            $request->validate([
                'items' => 'required',
                'media' => 'nullable|array|max:10',
                'media.*' => 'file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov|max:15360',
                'channel_id' => 'nullable|integer|exists:channels,id',
            ]);

            if (count($decodedItems) > 20) {
                return back()->withErrors(['items' => __('Maximum 20 blocs par publication.')])->withInput();
            }

            $uploaded = $request->file('media', []);
            $uploaded = is_array($uploaded) ? array_values(array_filter($uploaded)) : ($uploaded ? [$uploaded] : []);

            $textParts = [];
            $mediaSlots = 0;
            foreach ($decodedItems as $row) {
                $t = $row['type'] ?? '';
                if ($t === 'text') {
                    $textParts[] = (string) ($row['text'] ?? '');
                } elseif ($t === 'media') {
                    $mediaSlots++;
                }
            }

            if ($mediaSlots !== count($uploaded)) {
                return back()
                    ->withErrors(['items' => __('Le nombre de fichiers ne correspond pas au brouillon.')])
                    ->withInput();
            }

            $bodyForModeration = strtolower(implode("\n", array_filter(array_map('trim', $textParts))));
            foreach ($interdit as $mot) {
                if ($bodyForModeration !== '' && str_contains($bodyForModeration, $mot)) {
                    return back()->withErrors(['body' => 'Votre message contient un mot non autorisé par la charte de SupMTI.']);
                }
            }

            $nonEmptyTexts = array_values(array_filter($textParts, fn ($s) => trim($s) !== ''));
            if ($nonEmptyTexts === [] && count($uploaded) === 0) {
                return back()
                    ->withErrors(['body' => __('Texte ou au moins un média requis.')])
                    ->withInput();
            }

            $bodyTrim = implode("\n\n", array_map('trim', $nonEmptyTexts));

            $post = Post::create([
                'body' => $bodyTrim,
                'media_path' => null,
                'user_id' => Auth::id(),
                'university_id' => $uid,
                'channel_id' => $channelId,
            ]);

            $fileIndex = 0;
            $mediaOrder = 0;
            $order = 0;
            foreach ($decodedItems as $row) {
                $t = $row['type'] ?? '';
                if ($t === 'text') {
                    $txt = trim((string) ($row['text'] ?? ''));
                    if ($txt === '') {
                        continue;
                    }
                    PostItem::query()->create([
                        'post_id' => $post->id,
                        'position' => $order++,
                        'kind' => 'text',
                        'text' => $txt,
                        'post_media_id' => null,
                    ]);
                } elseif ($t === 'media') {
                    $file = $uploaded[$fileIndex] ?? null;
                    if (! $file) {
                        $post->delete();

                        return back()->withErrors(['items' => __('Fichier manquant.')])->withInput();
                    }
                    $path = $file->store('posts', 'public');
                    $pm = $post->medias()->create([
                        'path' => $path,
                        'position' => $mediaOrder++,
                    ]);
                    PostItem::query()->create([
                        'post_id' => $post->id,
                        'position' => $order++,
                        'kind' => 'media',
                        'text' => null,
                        'post_media_id' => $pm->id,
                    ]);
                    $fileIndex++;
                }
            }

            Auth::user()?->incrementKarma(1);

            return back()->with('success', 'Publication publiée.');
        }

        $bodyForModeration = strtolower((string) $request->input('body', ''));
        foreach ($interdit as $mot) {
            if ($bodyForModeration !== '' && str_contains($bodyForModeration, $mot)) {
                return back()->withErrors(['body' => 'Votre message contient un mot non autorisé par la charte de SupMTI.']);
            }
        }

        $request->validate([
            'body' => 'nullable|string|max:100000',
            'media' => 'nullable|array|max:10',
            'media.*' => 'file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov|max:15360',
            'channel_id' => 'nullable|integer|exists:channels,id',
        ]);

        $uploaded = $request->file('media', []);
        $uploaded = is_array($uploaded) ? array_values(array_filter($uploaded)) : [];

        $bodyRaw = $request->input('body');
        $bodyTrim = is_string($bodyRaw) ? trim($bodyRaw) : '';

        if ($bodyTrim === '' && count($uploaded) === 0) {
            return back()
                ->withErrors(['body' => __('Texte ou au moins un média requis.')])
                ->withInput();
        }

        $body = $bodyTrim;

        $post = Post::create([
            'body' => $body,
            'media_path' => null,
            'user_id' => Auth::id(),
            'university_id' => $uid,
            'channel_id' => $channelId,
        ]);

        foreach ($uploaded as $i => $file) {
            $path = $file->store('posts', 'public');
            $post->medias()->create([
                'path' => $path,
                'position' => (int) $i,
            ]);
        }

        if (Schema::hasTable('post_items')) {
            $p = 0;
            if (trim((string) $post->body) !== '') {
                PostItem::query()->create([
                    'post_id' => $post->id,
                    'position' => $p++,
                    'kind' => 'text',
                    'text' => $post->body,
                    'post_media_id' => null,
                ]);
            }
            foreach ($post->medias()->orderBy('position')->get() as $m) {
                PostItem::query()->create([
                    'post_id' => $post->id,
                    'position' => $p++,
                    'kind' => 'media',
                    'text' => null,
                    'post_media_id' => $m->id,
                ]);
            }
        }

        Auth::user()?->incrementKarma(1);

        return back()->with('success', 'Publication publiée.');
    }

    public function destroy(Post $post)
    {
        // Sécurité : Seul l'auteur peut supprimer son post
        if (Auth::id() !== $post->user_id) {
            abort(403);
        }

        $paths = $post->medias->pluck('path')->all();
        if ($post->media_path) {
            $paths[] = $post->media_path;
        }
        foreach (array_unique($paths) as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
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

        if ($post->university_id !== $user->university_id) {
            abort_unless(
                User::where('id', $post->user_id)->where('role', 'super_admin')->exists(),
                403
            );
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
                    ['post_id' => $post->id, 'actor_id' => $user->id]
                );
            }
        }

        if ($this->wantsJsonResponse($request)) {
            return response()->json($this->jsonLikeState($post->fresh(), $user));
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
            abort_unless(
                User::where('id', $post->user_id)->where('role', 'super_admin')->exists(),
                403
            );
        }

        if ($post->saves()->where('user_id', $user->id)->exists()) {
            $post->saves()->detach($user->id);
        } else {
            $post->saves()->attach($user->id);
        }

        if ($this->wantsJsonResponse($request)) {
            return response()->json($this->jsonSaveState($post->fresh(), $user));
        }

        return back();
    }

    public function storeComment(Request $request, Post $post)
    {
        $request->validate([
            'body'      => 'required|string|max:1000',
            'parent_id' => 'nullable|integer|exists:post_comments,id',
        ]);

        $user = Auth::user();
        if (! $user) {
            abort(403);
        }

        if ($post->university_id !== $user->university_id) {
            abort_unless(
                User::where('id', $post->user_id)->where('role', 'super_admin')->exists(),
                403
            );
        }

        $parentId = $request->filled('parent_id') ? (int) $request->parent_id : null;
        // Ne permettre qu'un seul niveau de réponse
        if ($parentId) {
            $parent = PostComment::find($parentId);
            if ($parent && $parent->parent_id) {
                $parentId = $parent->parent_id;
            }
        }

        PostComment::create([
            'post_id'   => $post->id,
            'user_id'   => $user->id,
            'parent_id' => $parentId,
            'body'      => $request->body,
        ]);

        $user->incrementKarma(1);

        $notifyUserId = $parentId
            ? (PostComment::find($parentId)?->user_id ?? $post->user_id)
            : $post->user_id;

        if ($notifyUserId !== $user->id) {
            UserNotification::notifyUser(
                $notifyUserId,
                'comment',
                'Nouveau commentaire',
                $user->name.' a répondu à votre commentaire.',
                ['post_id' => $post->id, 'actor_id' => $user->id]
            );
        }

        return back();
    }

    /**
     * Renvoyer du JSON seulement pour les appels type API (ex. axios avec Accept: application/json).
     * Ne pas confondre avec Inertia : toute visite Inertia est en XHR (ajax() = true) et envoie
     * l'en-tête X-Inertia — renvoyer du JSON briserait la visite (toast errors.generic, modale Inertia).
     */
    private function wantsJsonResponse(Request $request): bool
    {
        if ($request->header('X-Inertia')) {
            return false;
        }

        return $request->wantsJson() || $request->expectsJson();
    }

    /**
     * @return array{likes_count: int, liked_by_me: bool, likers_preview: array}
     */
    private function jsonLikeState(Post $post, User $user): array
    {
        $post->loadCount('likes');
        $coll = new EloquentCollection([$post]);
        PostLikersPreview::attach($coll);
        $p = $coll->first();
        $liked = $p->likes()->where('user_id', $user->id)->exists();

        return [
            'likes_count' => (int) $p->likes_count,
            'liked_by_me' => $liked,
            'likers_preview' => $p->getAttribute('likers_preview') ?? [],
        ];
    }

    /**
     * @return array{saves_count: int, saved_by_me: bool}
     */
    private function jsonSaveState(Post $post, User $user): array
    {
        $post->loadCount('saves');
        $saved = $post->saves()->where('user_id', $user->id)->exists();

        return [
            'saves_count' => (int) $post->saves_count,
            'saved_by_me' => $saved,
        ];
    }
}
