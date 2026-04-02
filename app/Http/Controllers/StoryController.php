<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $stories = Story::with('user:id,name')
            ->where('university_id', $user->university_id)
            ->where('expires_at', '>', now())
            ->latest()
            ->get();

        $ids = $stories->pluck('id');

        $viewsCounts = $ids->isEmpty()
            ? collect()
            : StoryView::query()
                ->whereIn('story_id', $ids)
                ->selectRaw('story_id, count(*) as c')
                ->groupBy('story_id')
                ->pluck('c', 'story_id');

        $myViews = $ids->isEmpty()
            ? collect()
            : StoryView::query()
                ->whereIn('story_id', $ids)
                ->where('viewer_id', $user->id)
                ->get()
                ->keyBy('story_id');

        $reactionCountsByStory = $ids->isEmpty()
            ? collect()
            : StoryView::query()
                ->whereIn('story_id', $ids)
                ->whereNotNull('reaction')
                ->selectRaw('story_id, reaction, count(*) as c')
                ->groupBy('story_id', 'reaction')
                ->get()
                ->groupBy('story_id')
                ->map(function ($rows) {
                    return $rows->mapWithKeys(fn ($row) => [$row->reaction => (int) $row->c]);
                });

        $myStoryIds = $stories->where('user_id', $user->id)->pluck('id');
        $viewersByStory = $myStoryIds->isEmpty()
            ? collect()
            : StoryView::query()
                ->whereIn('story_id', $myStoryIds)
                ->with('viewer:id,name')
                ->orderByDesc('created_at')
                ->get()
                ->groupBy('story_id')
                ->map(function ($rows) {
                    return $rows->map(fn (StoryView $v) => [
                        'id' => $v->viewer_id,
                        'name' => $v->viewer?->name ?? '?',
                        'reaction' => $v->reaction,
                        'seen_at' => $v->created_at?->toIso8601String(),
                    ])->values();
                });

        $stories = $stories->map(function (Story $story) use ($user, $viewsCounts, $myViews, $reactionCountsByStory, $viewersByStory) {
            $story->views_count = (int) ($viewsCounts[$story->id] ?? 0);
            $mv = $myViews[$story->id] ?? null;
            $story->viewed_by_me = $mv !== null;
            $story->my_reaction = $mv?->reaction;
            $story->reaction_counts = $reactionCountsByStory[$story->id] ?? [];
            $story->viewers = $story->user_id === $user->id
                ? ($viewersByStory[$story->id] ?? [])
                : [];

            return $story;
        });

        return Inertia::render('Stories/Index', [
            'stories' => $stories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'media' => 'required|file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov|max:20480',
        ]);

        $user = Auth::user();
        $path = $request->file('media')->store('stories', 'public');

        Story::create([
            'user_id' => $user->id,
            'university_id' => $user->university_id,
            'media_path' => $path,
            'expires_at' => now()->addHours(24),
        ]);

        $user->incrementKarma(1);

        return back()->with('success', 'Story publiée.');
    }

    public function destroy(Story $story)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if($story->user_id !== $user->id, 403);
        abort_if($story->university_id !== $user->university_id, 403);

        if ($story->media_path) {
            Storage::disk('public')->delete($story->media_path);
        }
        $story->delete();

        return back()->with('success', 'Story supprimée.');
    }

    public function markViewed(Story $story)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if($story->university_id !== $user->university_id, 403);

        $existing = $story->views()->where('viewer_id', $user->id)->first();
        $story->views()->updateOrCreate(
            ['viewer_id' => $user->id],
            ['reaction' => $existing?->reaction]
        );

        return back();
    }

    public function react(Request $request, Story $story)
    {
        $data = $request->validate([
            'reaction' => ['required', 'string', 'max:10'],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if($story->university_id !== $user->university_id, 403);

        $story->views()->updateOrCreate(
            ['viewer_id' => $user->id],
            ['reaction' => $data['reaction']]
        );

        return back();
    }
}
