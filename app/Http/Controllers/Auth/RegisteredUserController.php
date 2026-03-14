<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
    'name' => 'required|string|max:255',
    'email' => [
        'required',
        'string',
        'lowercase',
        'email',
        'max:255',
        'unique:'.User::class,
        // On vérifie que le domaine de l'email existe dans notre table universities
        function ($attribute, $value, $fail) {
            $domain = substr(strrchr($value, "@"), 1);
            if (!\App\Models\University::where('domain', $domain)->exists()) {
                $fail("Cette université n'est pas encore partenaire d'UniConnect.");
            }
        },
    ],
    'password' => ['required', 'confirmed', Rules\Password::defaults()],
]);

        $domain = substr(strrchr($request->email, "@"), 1);
        $university = \App\Models\University::where('domain', $domain)->first();

        $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'university_id' => $university ? $university->id : null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
