<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    $request->validate(['body' => 'required|string|max:1000']);

    Post::create([
        'body' => $request->body,
        'user_id' => Auth::id(),
        'university_id' => Auth::user()->university_id,
    ]);

    return back();
}

    public function destroy(Post $post)
    {
        // Sécurité : Seul l'auteur peut supprimer son post
        if (Auth::id() !== $post->user_id) {
            abort(403);
        }

        $post->delete();

        return back();
    }
}
