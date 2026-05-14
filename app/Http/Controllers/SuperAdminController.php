<?php

namespace App\Http\Controllers;

use App\Mail\ContactReplyMail;
use App\Models\ContactMessage;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['last_seen_at' => now()]);

        return Inertia::render('Admin/SuperDashboard', [
            'universities' => University::with('parent:id,name,domain')->orderBy('name')->get(),
            'rootUniversities' => University::rootCampuses()->orderBy('name')->get(['id', 'name', 'domain']),
            'admins' => User::with('university:id,name')
                ->whereIn('role', ['admin', 'super_admin'])
                ->orderByDesc('created_at')
                ->get(['id', 'name', 'email', 'role', 'university_id', 'created_at']),
            'contactMessages' => ContactMessage::with('user:id,name,email')
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(),
            'unreadContactCount' => ContactMessage::whereNull('read_at')->count(),
        ]);
    }

    public function markContactMessagesRead()
    {
        ContactMessage::whereNull('read_at')->update(['read_at' => now()]);

        return back()->with('success', 'Messages « Contactez-nous » marqués comme lus.');
    }

    public function storeUniversity(Request $request)
    {
        if ($request->input('parent_university_id') === '') {
            $request->merge(['parent_university_id' => null]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'domain' => ['required', 'string', 'max:255', 'unique:universities,domain'],
            'is_active' => ['nullable', 'boolean'],
            'parent_university_id' => [
                'nullable',
                Rule::exists('universities', 'id')->where(fn ($q) => $q->whereNull('parent_university_id')),
            ],
        ]);

        $domain = strtolower(trim($data['domain']));
        $domain = ltrim($domain, '@');
        $domain = preg_replace('#^https?://#', '', $domain);
        $domain = rtrim($domain, '/');

        $university = University::create([
            'name' => trim($data['name']),
            'domain' => $domain,
            'is_active' => $data['is_active'] ?? true,
            'parent_university_id' => $data['parent_university_id'] ?? null,
        ]);

        if ($university->parent_university_id) {
            $university->reassignLinkedDataToParent();
        }

        $msg = $university->parent_university_id
            ? 'Domaine ajouté et rattaché au campus principal : les comptes @'.$domain.' sont gérés par le même admin.'
            : 'Université ajoutée (1 domaine email = 1 ligne, unique dans toute l’application).';

        return back()->with('success', $msg);
    }

    public function updateUniversity(Request $request, University $university)
    {
        if ($request->input('parent_university_id') === '') {
            $request->merge(['parent_university_id' => null]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'domain' => ['required', 'string', 'max:255', Rule::unique('universities', 'domain')->ignore($university->id)],
            'is_active' => ['required', 'boolean'],
            'parent_university_id' => [
                'nullable',
                Rule::notIn([$university->id]),
                Rule::exists('universities', 'id')->where(fn ($q) => $q->whereNull('parent_university_id')),
            ],
        ]);

        $domain = strtolower(trim($data['domain']));
        $domain = ltrim($domain, '@');
        $domain = preg_replace('#^https?://#', '', $domain);
        $domain = rtrim($domain, '/');

        $hadParent = $university->parent_university_id !== null;
        $newParentId = $data['parent_university_id'] ?? null;

        if ($newParentId && $university->domainAliases()->exists()) {
            return back()->withErrors([
                'parent_university_id' => 'Cette université a des domaines e-mail rattachés : elle ne peut pas être rattachée à un autre campus.',
            ]);
        }

        $university->update([
            'name' => trim($data['name']),
            'domain' => $domain,
            'is_active' => $data['is_active'],
            'parent_university_id' => $newParentId,
        ]);

        if ($newParentId && ! $hadParent) {
            $university->reassignLinkedDataToParent();
        }

        return back()->with('success', 'Université mise à jour.');
    }

    public function destroyUniversity(University $university)
    {
        if ($university->domainAliases()->exists()) {
            return back()->withErrors([
                'university' => 'Supprimez d’abord les domaines e-mail supplémentaires rattachés à cette université.',
            ]);
        }

        if ($university->parent_university_id !== null) {
            $university->reassignLinkedDataToParent();
        }

        $count = User::where('university_id', $university->id)->count();
        if ($count > 0) {
            return back()->withErrors([
                'university' => "Impossible de supprimer : {$count} compte(s) utilisateur sont encore liés à cette université. Supprimez ou réassignez ces comptes d'abord.",
            ]);
        }

        $university->delete();

        return back()->with('success', 'Université et domaine supprimés.');
    }

    public function storeAdmin(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'university_id' => [
                'required_if:role,admin',
                'nullable',
                Rule::exists('universities', 'id')->where(fn ($q) => $q->whereNull('parent_university_id')),
            ],
            'role' => ['required', Rule::in(['admin', 'super_admin'])],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'university_id' => $data['role'] === 'admin' ? $data['university_id'] : null,
            'email_verified_at' => now(),
            'requires_email_verification' => false,
        ]);

        return back()->with('success', 'Compte administrateur créé.');
    }

    public function updateAdmin(Request $request, User $user)
    {
        abort_unless(in_array($user->role, ['admin', 'super_admin'], true), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'university_id' => [
                'nullable',
                Rule::exists('universities', 'id')->where(fn ($q) => $q->whereNull('parent_university_id')),
            ],
            'role' => ['required', Rule::in(['admin', 'super_admin'])],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'role' => $data['role'],
            'university_id' => $data['role'] === 'admin' ? ($data['university_id'] ?: null) : null,
        ]);

        return back()->with('success', 'Administrateur mis à jour.');
    }

    public function destroyAdmin(User $user)
    {
        abort_unless(in_array($user->role, ['admin', 'super_admin'], true), 404);
        abort_if(Auth::id() === $user->id, 422, 'Vous ne pouvez pas supprimer votre propre compte.');
        $user->delete();

        return back()->with('success', 'Administrateur supprimé.');
    }

    public function replyContact(Request $request, ContactMessage $message)
    {
        $data = $request->validate([
            'reply' => ['required', 'string', 'min:5', 'max:5000'],
        ]);

        $recipientEmail = $message->is_anonymous
            ? ($message->user?->email)
            : $message->email;

        $recipientName = $message->is_anonymous
            ? ($message->user?->name ?? 'Utilisateur')
            : ($message->name ?? 'Utilisateur');

        if (! $recipientEmail) {
            return response()->json(['error' => 'Aucune adresse email disponible pour ce message.'], 422);
        }

        if (! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        Mail::to($recipientEmail, $recipientName)
            ->send(new ContactReplyMail($recipientName, $data['reply'], $message->body));

        return response()->json(['ok' => true]);
    }
}
