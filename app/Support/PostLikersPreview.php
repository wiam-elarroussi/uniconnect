<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PostLikersPreview
{
    /**
     * Attache à chaque post un tableau likers_preview (max 50) pour l’affichage.
     *
     * @param  Collection<int, \App\Models\Post>  $posts
     */
    public static function attach(Collection $posts): void
    {
        if ($posts->isEmpty()) {
            return;
        }

        $ids = $posts->pluck('id')->all();

        $rows = DB::table('post_likes')
            ->join('users', 'users.id', '=', 'post_likes.user_id')
            ->whereIn('post_likes.post_id', $ids)
            ->orderByDesc('post_likes.created_at')
            ->select(
                'post_likes.post_id',
                'users.id as user_id',
                'users.name',
                'users.avatar_path',
                'users.avatar_builder'
            )
            ->get();

        $byPost = [];

        foreach ($rows as $row) {
            $pid = (int) $row->post_id;
            if (! isset($byPost[$pid])) {
                $byPost[$pid] = [];
            }
            if (count($byPost[$pid]) >= 50) {
                continue;
            }
            $builder = $row->avatar_builder;
            if (is_string($builder)) {
                $decoded = json_decode($builder, true);
                $builder = is_array($decoded) ? $decoded : null;
            } elseif (! is_array($builder)) {
                $builder = null;
            }

            $byPost[$pid][] = [
                'id' => (int) $row->user_id,
                'name' => $row->name,
                'avatar_url' => $row->avatar_path ? asset('storage/'.$row->avatar_path) : null,
                'avatar_builder' => $builder,
            ];
        }

        foreach ($posts as $post) {
            $post->setAttribute('likers_preview', $byPost[$post->id] ?? []);
        }
    }
}
