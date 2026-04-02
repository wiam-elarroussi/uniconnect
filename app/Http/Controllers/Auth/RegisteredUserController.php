<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\User;
use App\Rules\ValidDisplayName;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', new ValidDisplayName],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class,
                function ($attribute, $value, $fail) {
                    if (app()->environment('testing')) {
                        return;
                    }
                    $domain = substr(strrchr($value, '@'), 1);
                    if (! University::where('domain', $domain)->where('is_active', true)->exists()) {
                        $fail("Cette université n'est pas encore partenaire d'UniConnect.");
                    }
                },
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $domain = substr(strrchr($request->email, '@'), 1);
        $university = University::where('domain', $domain)->where('is_active', true)->first();
        $canonicalUniversityId = $university ? $university->canonicalId() : null;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'university_id' => $canonicalUniversityId,
            'role' => 'student',
            'requires_email_verification' => true,
        ]);

        Auth::login($user);

        try {
            event(new Registered($user));
        } catch (\Throwable $e) {
            Log::warning('Registered event failed (verification email).', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('verification.notice')->with(
                'warning',
                'Compte créé, mais l’email de vérification n’a pas pu être envoyé. Utilisez « Renvoyer l’email » sur la page suivante.'
            );
        }

        return redirect()->route('verification.notice');
    }
}
