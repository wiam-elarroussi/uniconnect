/**
 * Hostinger « Deploy with Node » attend souvent un dossier à la racine (ex. dist/).
 * Laravel + Vite écrit dans public/build/ — on duplique ici pour la validation du pipeline.
 */
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public', 'build');
const dest = join(root, 'dist');

if (!existsSync(src) || !statSync(src).isDirectory()) {
    console.error('sync-hostinger-output: public/build introuvable — lancez vite build avant.');
    process.exit(1);
}

if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
}
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('sync-hostinger-output: public/build → dist (copie pour Hostinger)');
