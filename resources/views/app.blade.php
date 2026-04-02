<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="UniConnect — Le réseau social académique éthique de SupMTI">
        <meta name="theme-color" content="#2563EB">

        <title inertia>{{ config('app.name', 'UniConnect') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/logo_transparent.png">

        <!-- Inter depuis Google Fonts (chargé ici une seule fois pour toute l'app) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

        <!-- Scripts Inertia + Vite -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-slate-50">
        @inertia
    </body>
</html>