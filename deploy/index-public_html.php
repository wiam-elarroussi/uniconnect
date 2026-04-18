<?php

/**
 * À utiliser UNIQUEMENT quand :
 * - la racine web du domaine = public_html/
 * - tout Laravel est dans public_html/laravel/
 * - le contenu de laravel/public/ a été copié dans public_html/ (build, .htaccess, etc.)
 *
 * Copie ce fichier vers : public_html/index.php
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$laravelRoot = __DIR__.'/laravel';

if (! is_dir($laravelRoot)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Configuration Hostinger : dossier introuvable — vérifiez que Laravel est dans public_html/laravel/\n";
    exit(1);
}

if (file_exists($maintenance = $laravelRoot.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $laravelRoot.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $laravelRoot.'/bootstrap/app.php';

$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
