<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Vérifie l’e-mail via URL signée (sans session obligatoire).
     * Évite le 403 « unauthorized » quand l’utilisateur ouvre le lien hors du navigateur d’inscription.
     */
    public function __invoke(Request $request, string $id, string $hash): RedirectResponse
    {
        $user = User::query()->find($id);

        if (! $user) {
            abort(404);
        }

        if (! hash_equals((string) $hash, sha1((string) $user->getEmailForVerification()))) {
            abort(403, 'Lien de vérification invalide ou expiré.');
        }

        if (! hash_equals((string) $id, (string) $user->getKey())) {
            abort(403, 'Lien de vérification invalide ou expiré.');
        }

        if ($user->hasVerifiedEmail()) {
            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
