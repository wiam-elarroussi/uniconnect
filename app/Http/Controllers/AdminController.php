<?php

// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();
        $admin->update(['last_seen_at' => now()]);
        $universityId = $admin->university_id;
        $university = optional($admin->university)->name ?? 'Université';

        $totalUsers = User::where('university_id', $universityId)->where('role', 'student')->count();
        $totalPosts = Post::where('university_id', $universityId)->count();
        $postsToday = Post::where('university_id', $universityId)->whereDate('created_at', today())->count();
        $newUsersWeek = User::where('university_id', $universityId)->where('created_at', '>=', now()->subDays(7))->count();
        $activeUsers = User::where('university_id', $universityId)->where('last_seen_at', '>=', now()->subMinutes(15))->count();

        $postsChart = collect(range(6, 0))->map(fn ($i) => [
            'date' => now()->subDays($i)->format('d/m'),
            'count' => Post::where('university_id', $universityId)->whereDate('created_at', now()->subDays($i))->count(),
        ])->values();

        $topContributors = User::where('university_id', $universityId)
            ->withCount('posts')
            ->where('role', 'student')
            ->orderByDesc('posts_count')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        $recentPosts = Post::with('user:id,name,email')
            ->where('university_id', $universityId)
            ->latest()
            ->limit(10)
            ->get();

        $recentUsers = User::where('university_id', $universityId)
            ->latest()
            ->limit(8)
            ->get(['id', 'name', 'email', 'created_at', 'is_banned', 'campus_role', 'role']);

        $campusMembers = User::where('university_id', $universityId)
            ->where('role', '!=', 'super_admin')
            ->orderBy('name')
            ->limit(250)
            ->get(['id', 'name', 'email', 'created_at', 'is_banned', 'campus_role', 'role']);

        $channels = Channel::where('university_id', $universityId)->orderBy('name')->get(['id', 'name', 'slug', 'created_at']);

        $libraryResources = Resource::where('university_id', $universityId)
            ->with('user:id,name')
            ->latest()
            ->limit(40)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'university' => $university,
            'stats' => compact('totalUsers', 'totalPosts', 'postsToday', 'newUsersWeek', 'activeUsers'),
            'postsChart' => $postsChart,
            'topContributors' => $topContributors,
            'recentPosts' => $recentPosts,
            'recentUsers' => $recentUsers,
            'campusMembers' => $campusMembers,
            'channels' => $channels,
            'libraryResources' => $libraryResources,
        ]);
    }

    public function updateCampusRole(Request $request, User $user)
    {
        $this->authorizeUniversity($user);
        abort_if($user->role === 'super_admin', 403);

        $data = $request->validate([
            'campus_role' => ['required', 'string', 'in:student,teacher,staff'],
        ]);

        $user->update(['campus_role' => $data['campus_role']]);

        return back()->with('success', 'Rôle campus enregistré (visible sur le profil).');
    }

    public function storeChannel(Request $request)
    {
        $admin = Auth::user();
        abort_if(! $admin || ! $admin->isAdmin(), 403);

        $request->validate([
            'name' => 'required|string|max:120',
        ]);

        $slug = Str::slug($request->name) ?: 'canal';
        $base = $slug;
        $i = 1;
        while (Channel::where('university_id', $admin->university_id)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        Channel::create([
            'university_id' => $admin->university_id,
            'created_by' => $admin->id,
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return back()->with('success', 'Canal créé. Les étudiants peuvent y publier depuis le fil.');
    }

    public function destroyChannel(Channel $channel)
    {
        $admin = Auth::user();
        abort_if(! $admin || ! $admin->isAdmin(), 403);
        abort_if($channel->university_id !== $admin->university_id, 403);
        $channel->delete();

        return back()->with('success', 'Canal supprimé.');
    }

    public function destroyResource(Resource $resource)
    {
        $admin = Auth::user();
        abort_if(! $admin || ! $admin->isAdmin(), 403);
        abort_if($resource->university_id !== $admin->university_id, 403);
        $resource->delete();

        return back()->with('success', 'Ressource supprimée de la bibliothèque.');
    }

    // ── Actions modération ────────────────────────────────────────────────
    public function deletePost(Post $post)
    {
        $this->authorizeUniversity($post->user);
        $post->delete();

        return back()->with('success', 'Publication supprimée.');
    }

    public function deleteUser(User $user)
    {
        $this->authorizeUniversity($user);
        abort_if($user->isAdmin(), 403, 'Action non autorisée sur un compte administrateur.');
        $user->posts()->delete();
        $user->delete();

        return back()->with('success', 'Compte supprimé (RGPD).');
    }

    public function toggleBanUser(User $user)
    {
        $this->authorizeUniversity($user);
        $user->update(['is_banned' => ! $user->is_banned]);
        $msg = $user->is_banned ? 'Utilisateur suspendu.' : 'Utilisateur réactivé.';

        return back()->with('success', $msg);
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    private function authorizeUniversity(User $target): void
    {
        $adminUniversityId = Auth::user()->university_id;
        abort_if($adminUniversityId !== $target->university_id, 403, 'Vous ne pouvez pas gérer cette université.');
    }
}
