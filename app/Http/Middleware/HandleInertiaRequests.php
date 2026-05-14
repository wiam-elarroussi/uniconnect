<?php

namespace App\Http\Middleware;

use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $localeDir = $locale === 'ar' ? 'rtl' : 'ltr';
        $localeNames = Config::get('locales.names', []);

        return [
            ...parent::share($request),
            'locale' => $locale,
            'localeDir' => $localeDir,
            'availableLocales' => collect(Config::get('locales.available', []))->map(function (string $code) use ($localeNames) {
                return [
                    'code' => $code,
                    'label' => $localeNames[$code] ?? strtoupper($code),
                ];
            })->values()->all(),
            // Mis à jour à chaque visite Inertia : le front peut synchroniser <meta name="csrf-token"> pour éviter les 419.
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $request->user(),
            ],
            'unreadNotificationsCount' => $request->user()
                ? UserNotification::where('user_id', $request->user()->id)->whereNull('read_at')->count()
                : 0,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }
}
