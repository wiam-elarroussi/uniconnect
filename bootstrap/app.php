<?php

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Reverse proxy / SSL terminé (Hostinger, Cloudflare, etc.) : détecte HTTPS pour les cookies Secure.
        $middleware->trustProxies(at: '*');

        // Utilisateur déjà connecté sur /login ou /register : évite login → dashboard → verify-email
        // (double redirection qui peut faire « clignoter » ou casser Inertia si la session est fragile).
        $middleware->redirectUsersTo(static function (Request $request): string {
            $user = $request->user();
            if ($user instanceof MustVerifyEmail && ! $user->hasVerifiedEmail()) {
                return route('verification.notice', absolute: false);
            }
            if ($user && $user->isSuperAdmin()) {
                return route('superadmin.dashboard', absolute: false);
            }
            if ($user && $user->isAdmin()) {
                return route('admin.dashboard', absolute: false);
            }

            return route('dashboard', absolute: false);
        });

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
            'super_admin' => \App\Http\Middleware\IsSuperAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Les requêtes Inertia (X-Inertia) doivent recevoir du JSON pour les erreurs de validation,
        // sinon Laravel renvoie une redirection HTML et le client Inertia voit une réponse « invalide »
        // (page qui clignote / se recharge sans message).
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e) {
            return $request->expectsJson()
                || ($request->hasHeader('X-Inertia') && $e instanceof ValidationException);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return null;
            }

            return Inertia::render('Errors/404', ['status' => 404])
                ->toResponse($request)
                ->setStatusCode(404);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, Request $request) {
            if ($e->getStatusCode() !== 500 || $request->expectsJson() || config('app.debug')) {
                return null;
            }

            return Inertia::render('Errors/500', ['status' => 500])
                ->toResponse($request)
                ->setStatusCode(500);
        });
    })->create();
