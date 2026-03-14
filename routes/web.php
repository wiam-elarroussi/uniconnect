<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();
    
    // On récupère les posts de l'université de l'utilisateur, avec le nom de l'auteur
    $posts = App\Models\Post::where('university_id', $user->university_id)
        ->with('user')
        ->latest()
        ->get();

    return Inertia::render('Dashboard', [
        'university' => $user->university ? $user->university->name : 'Étudiant',
        'posts' => $posts,
        'resources' => App\Models\Resource::where('university_id', $user->university_id)->with('user')->latest()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/posts', [App\Http\Controllers\PostController::class, 'store'])->middleware(['auth'])->name('posts.store');

Route::delete('/posts/{post}', [App\Http\Controllers\PostController::class, 'destroy'])->name('posts.destroy');

Route::post('/resources', [App\Http\Controllers\ResourceController::class, 'store'])->name('resources.store');

require __DIR__.'/auth.php';
