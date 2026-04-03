@php
    $htmlLocale = str_replace('_', '-', app()->getLocale());
    $isRtl = app()->getLocale() === 'ar';
@endphp
<!DOCTYPE html>
<html lang="{{ $htmlLocale }}" dir="{{ $isRtl ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="description" content="UniConnect — Le réseau social académique éthique de SupMTI">
        <meta name="theme-color" content="#2563EB">

        {{-- Aligne react-i18next sur la session Laravel avant le chargement du bundle Vite --}}
        <script>
            window.__INITIAL_LOCALE__ = @json(app()->getLocale());
            window.__INITIAL_LOCALE_DIR__ = @json(app()->getLocale() === 'ar' ? 'rtl' : 'ltr');
        </script>

        <title inertia>{{ config('app.name', 'UniConnect') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/logo_transparent.png">

        <!-- Inter depuis Google Fonts (chargé ici une seule fois pour toute l'app) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        @if ($isRtl)
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
        @endif

        <!-- Scripts Inertia + Vite -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-slate-50 {{ $isRtl ? 'font-arabic' : '' }}">
        @inertia
    </body>
</html>