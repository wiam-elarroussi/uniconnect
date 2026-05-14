<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CampusChannelsController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MyPostsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedPostController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\SuggestionsController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard principal
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');

    // Modération
    Route::delete('/posts/{post}', [AdminController::class, 'deletePost'])->name('posts.delete');
    Route::delete('/comments/{comment}', [AdminController::class, 'deleteComment'])->name('comments.delete');
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');
    Route::patch('/users/{user}/ban', [AdminController::class, 'toggleBanUser'])->name('users.ban');
    Route::patch('/users/{user}/campus-role', [AdminController::class, 'updateCampusRole'])->name('users.campus-role');

    Route::post('/channels', [AdminController::class, 'storeChannel'])->name('channels.store');
    Route::delete('/channels/{channel}', [AdminController::class, 'destroyChannel'])->name('channels.destroy');
    Route::delete('/resources/{resource}', [AdminController::class, 'destroyResource'])->name('resources.destroy');
});

Route::middleware(['auth', 'verified', 'super_admin'])->prefix('super-admin')->name('superadmin.')->group(function () {
    Route::get('/', [SuperAdminController::class, 'index'])->name('dashboard');

    Route::post('/universities', [SuperAdminController::class, 'storeUniversity'])->name('universities.store');
    Route::patch('/universities/{university}', [SuperAdminController::class, 'updateUniversity'])->name('universities.update');
    Route::delete('/universities/{university}', [SuperAdminController::class, 'destroyUniversity'])->name('universities.destroy');

    Route::post('/admins', [SuperAdminController::class, 'storeAdmin'])->name('admins.store');
    Route::patch('/admins/{user}', [SuperAdminController::class, 'updateAdmin'])->name('admins.update');
    Route::delete('/admins/{user}', [SuperAdminController::class, 'destroyAdmin'])->name('admins.destroy');

    Route::post('/contact-messages/read-all', [SuperAdminController::class, 'markContactMessagesRead'])->name('contact.read-all');
    Route::post('/contact-messages/{message}/reply', [SuperAdminController::class, 'replyContact'])->name('contact.reply');
});

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:8,1')
    ->name('contact.store');

Route::post('/contact/anonymous', [ContactController::class, 'storeAnonymous'])
    ->middleware(['auth', 'verified', 'throttle:8,1'])
    ->name('contact.anonymous');

Route::post('/contact/open', [ContactController::class, 'storeOpen'])
    ->middleware('throttle:8,1')
    ->name('contact.open');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/mes-posts', MyPostsController::class)->middleware(['auth', 'verified'])->name('my-posts.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])->name('users.follow.toggle');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::match(['patch', 'post'], '/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/posts', [App\Http\Controllers\PostController::class, 'store'])->middleware(['auth', 'verified'])->name('posts.store');

Route::delete('/posts/{post}', [App\Http\Controllers\PostController::class, 'destroy'])->middleware(['auth', 'verified'])->name('posts.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike'])->name('posts.likes.toggle');
    Route::post('/posts/{post}/save', [PostController::class, 'toggleSave'])->name('posts.saves.toggle');
    Route::post('/posts/{post}/comments', [PostController::class, 'storeComment'])->name('posts.comments.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::get('/stories', [StoryController::class, 'index'])->name('stories.index');
    Route::post('/stories', [StoryController::class, 'store'])->name('stories.store');
    Route::post('/stories/{story}/view', [StoryController::class, 'markViewed'])->name('stories.view');
    Route::post('/stories/{story}/react', [StoryController::class, 'react'])->name('stories.react');
    Route::delete('/stories/{story}', [StoryController::class, 'destroy'])->name('stories.destroy');

    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::post('/messages/groupes', [MessageController::class, 'storeGroup'])->name('messages.groups.store');
    Route::delete('/messages/direct/{peer}', [MessageController::class, 'destroyDirect'])->name('messages.direct.destroy');
    Route::delete('/messages/groupes/{conversation}', [MessageController::class, 'destroyGroup'])->name('messages.groups.destroy');

    Route::get('/saved-posts', [SavedPostController::class, 'index'])->name('saved-posts.index');

    Route::post('/chat/message', [ChatController::class, 'message'])->name('chat.message');

    Route::get('/canaux', [CampusChannelsController::class, 'index'])->name('channels.index');
    Route::get('/canaux/{channel}', [CampusChannelsController::class, 'show'])->name('channels.show');
    Route::post('/canaux/{channel}/follow', [CampusChannelsController::class, 'toggleFollow'])->name('channels.follow.toggle');

    Route::get('/bibliotheque', [LibraryController::class, 'index'])->name('library.index');
    Route::get('/suggestions', [SuggestionsController::class, 'index'])->name('suggestions.index');
});

Route::post('/resources', [App\Http\Controllers\ResourceController::class, 'store'])->middleware(['auth', 'verified'])->name('resources.store');

require __DIR__.'/auth.php';
