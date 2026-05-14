<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        abort_if(! $user || ! $user->university_id, 403);

        $q = Resource::query()
            ->where('university_id', $user->university_id)
            ->with(['user' => fn ($rel) => $rel->select(['id', 'name', 'avatar_path', 'avatar_builder'])])
            ->latest();

        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $q->where(function ($qq) use ($term) {
                $qq->where('title', 'like', $term)
                    ->orWhere('category', 'like', $term)
                    ->orWhere('filiere', 'like', $term);
            });
        }

        if ($request->filled('category') && $request->string('category') !== 'all') {
            $q->where('category', $request->string('category'));
        }

        if ($request->filled('filiere') && $request->string('filiere') !== 'all') {
            $q->where('filiere', $request->string('filiere'));
        }

        $resources = $q->limit(200)->get();

        $base = Resource::query()->where('university_id', $user->university_id);

        $categoryOptions = (clone $base)->select('category')->distinct()->orderBy('category')->pluck('category')->values();
        $filiereOptions = (clone $base)->whereNotNull('filiere')->where('filiere', '!=', '')->select('filiere')->distinct()->orderBy('filiere')->pluck('filiere')->values();

        return Inertia::render('Library/Index', [
            'resources' => $resources,
            'filters' => [
                'q' => $request->string('q'),
                'category' => $request->string('category', 'all'),
                'filiere' => $request->string('filiere', 'all'),
            ],
            'categoryOptions' => $categoryOptions,
            'filiereOptions' => $filiereOptions,
        ]);
    }
}
