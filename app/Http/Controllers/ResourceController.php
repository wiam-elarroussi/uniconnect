<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResourceController extends Controller
{
    public function store(Request $request) 
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'link' => 'required|url',
            'category' => 'required|string'
        ]);

        // On récupère l'utilisateur connecté de façon sécurisée
        $user = Auth::user();

        Resource::create([
            'title' => $request->title,
            'link' => $request->link,
            'category' => $request->category,
            'user_id' => $user->id,
            'university_id' => $user->university_id,
        ]);

        return back();
    }
}