<?php

// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();
        $admin->update(['last_seen_at' => now()]);
        $universityId = $admin->university_id;
        $university = optional($admin->university)->name ?? 'Université';

        $partialKeys = null;
        if ($request->header('X-Inertia')
            && ($partial = $request->header('X-Inertia-Partial-Data'))
            && $request->header('X-Inertia-Partial-Component') === 'Admin/Dashboard') {
            $parsed = array_filter(array_map('trim', explode(',', $partial)));
            if ($parsed !== []) {
                $partialKeys = $parsed;
            }
        }

        $props = $this->adminDashboardProps($universityId, $university, $partialKeys);

        return Inertia::render('Admin/Dashboard', $props);
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
            'description' => 'nullable|string|max:600',
            'avatar' => 'nullable|image|max:4096',
        ]);

        $slug = Str::slug($request->name) ?: 'canal';
        $base = $slug;
        $i = 1;
        while (Channel::where('university_id', $admin->university_id)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('channel-avatars', 'public');
        }

        Channel::create([
            'university_id' => $admin->university_id,
            'created_by' => $admin->id,
            'name' => $request->name,
            'description' => $request->input('description'),
            'slug' => $slug,
            'avatar_path' => $avatarPath,
        ]);

        return back()->with('success', 'Canal créé. Les étudiants peuvent y publier depuis le fil.');
    }

    public function destroyChannel(Channel $channel)
    {
        $admin = Auth::user();
        abort_if(! $admin || ! $admin->isAdmin(), 403);
        abort_if($channel->university_id !== $admin->university_id, 403);
        if ($channel->avatar_path) {
            Storage::disk('public')->delete($channel->avatar_path);
        }
        $channel->delete();

        return back()->with('success', 'Canal supprimé.');
    }

    public function deleteComment(PostComment $comment)
    {
        $this->authorizeUniversity($comment->user);
        $comment->delete();

        return back()->with('success', 'Commentaire supprimé.');
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
        $nextBanned = ! (bool) $user->is_banned;
        User::whereKey($user->id)->update(['is_banned' => $nextBanned]);
        if ($nextBanned) {
            DB::table('sessions')->where('user_id', $user->id)->delete();
        }
        $user->refresh();
        $msg = $user->is_banned ? 'Utilisateur suspendu.' : 'Utilisateur réactivé.';

        return back()->with('success', $msg);
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    /**
     * @param  list<string>|null  $only  Clés Inertia à calculer (rechargement partiel).
     * @return array<string, mixed>
     */
    private function adminDashboardProps(mixed $universityId, string $university, ?array $only = null): array
    {
        $want = $only !== null ? array_flip($only) : null;
        $all = $want === null;

        $props = [];

        if ($all || isset($want['university'])) {
            $props['university'] = $university;
        }

        if ($all || isset($want['stats'])) {
            $totalUsers = User::where('university_id', $universityId)->where('role', 'student')->count();
            $totalPosts = Post::where('university_id', $universityId)->count();
            $postsToday = Post::where('university_id', $universityId)->whereDate('created_at', today())->count();
            $newUsersWeek = User::where('university_id', $universityId)->where('created_at', '>=', now()->subDays(7))->count();
            $activeUsers = User::where('university_id', $universityId)->where('last_seen_at', '>=', now()->subMinutes(15))->count();
            $props['stats'] = compact('totalUsers', 'totalPosts', 'postsToday', 'newUsersWeek', 'activeUsers');
        }

        if ($all || isset($want['postsChart'])) {
            $props['postsChart'] = collect(range(6, 0))->map(fn ($i) => [
                'date' => now()->subDays($i)->format('d/m'),
                'count' => Post::where('university_id', $universityId)->whereDate('created_at', now()->subDays($i))->count(),
            ])->values();
        }

        if ($all || isset($want['topContributors'])) {
            $props['topContributors'] = User::where('university_id', $universityId)
                ->whereRaw('(select count(*) from posts where posts.user_id = users.id) > 0')
                ->withCount('posts')
                ->orderByDesc('posts_count')
                ->limit(5)
                ->get(['id', 'name', 'email', 'role', 'created_at']);
        }

        if ($all || isset($want['recentPosts'])) {
            $props['recentPosts'] = Post::with('user:id,name,email')
                ->where('university_id', $universityId)
                ->withCount(['likes', 'comments'])
                ->latest()
                ->limit(60)
                ->get();
        }

        if ($all || isset($want['recentComments'])) {
            $props['recentComments'] = PostComment::with(['user:id,name,email', 'post:id,body,university_id'])
                ->whereHas('post', fn ($q) => $q->where('university_id', $universityId))
                ->latest()
                ->limit(60)
                ->get(['id', 'post_id', 'user_id', 'body', 'created_at']);
        }

        if ($all || isset($want['recentUsers'])) {
            $props['recentUsers'] = User::where('university_id', $universityId)
                ->latest()
                ->limit(8)
                ->get(['id', 'name', 'email', 'created_at', 'is_banned', 'campus_role', 'role']);
        }

        if ($all || isset($want['campusMembers'])) {
            // Also include orphaned accounts (null university_id) whose email domain
            // matches this university — these block new registrations even though
            // they don't appear in normal university queries.
            $uniDomains = [];
            $uni = \App\Models\University::with('domainAliases:id,domain,parent_university_id')
                ->find($universityId);
            if ($uni) {
                $uniDomains[] = $uni->domain;
                foreach ($uni->domainAliases as $alias) {
                    $uniDomains[] = $alias->domain;
                }
            }

            $props['campusMembers'] = User::where(function ($q) use ($universityId, $uniDomains) {
                $q->where('university_id', $universityId);
                if (! empty($uniDomains)) {
                    $q->orWhere(function ($q2) use ($uniDomains) {
                        $q2->whereNull('university_id');
                        foreach ($uniDomains as $d) {
                            $q2->orWhereRaw('email LIKE ?', ['%@'.$d]);
                        }
                    });
                }
            })
                ->where('role', '!=', 'super_admin')
                ->withCount('posts')
                ->orderBy('name')
                ->limit(250)
                ->get(['id', 'name', 'email', 'university_id', 'created_at', 'last_seen_at', 'is_banned', 'campus_role', 'role']);
        }

        if ($all || isset($want['channels'])) {
            $props['channels'] = Channel::where('university_id', $universityId)->orderBy('name')->get(['id', 'name', 'description', 'slug', 'avatar_path', 'created_at']);
        }

        if ($all || isset($want['libraryResources'])) {
            $props['libraryResources'] = Resource::where('university_id', $universityId)
                ->with('user:id,name')
                ->latest()
                ->limit(40)
                ->get();
        }

        return $props;
    }

    private function authorizeUniversity(User $target): void
    {
        $admin = Auth::user();
        $adminUniversityId = $admin->university_id;

        if ($adminUniversityId === $target->university_id) {
            return;
        }

        // Allow acting on orphaned accounts (null university_id) whose email domain
        // belongs to this admin's university.
        if ($target->university_id === null && $adminUniversityId !== null) {
            $emailDomain = substr(strrchr($target->email, '@'), 1);
            $uni = \App\Models\University::with('domainAliases:id,domain,parent_university_id')
                ->find($adminUniversityId);
            if ($uni) {
                $allDomains = array_merge(
                    [$uni->domain],
                    $uni->domainAliases->pluck('domain')->toArray()
                );
                if (in_array($emailDomain, $allDomains, true)) {
                    return;
                }
            }
        }

        abort(403, 'Vous ne pouvez pas gérer cette université.');
    }
}
