<?php

namespace App\Console\Commands;

use App\Models\University;
use Illuminate\Console\Command;

/**
 * Rattache les lignes « campus » en double (même nom, plusieurs domaines) :
 * garde l’ID le plus bas comme campus principal et définit parent_university_id sur les autres,
 * puis déplace users / posts / canaux / ressources vers le parent.
 */
class LinkDuplicateCampusDomains extends Command
{
    /** Ne pas rattacher automatiquement des domaines « grand public » (erreur de saisie). */
    private const PUBLIC_EMAIL_DOMAINS = [
        'gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com',
        'yahoo.com', 'yahoo.fr', 'ymail.com', 'icloud.com', 'me.com', 'mac.com',
        'protonmail.com', 'proton.me', 'zoho.com',
    ];

    protected $signature = 'university:link-duplicate-campuses
                            {--dry-run : Afficher sans modifier}
                            {--allow-public-email-domains : Autoriser Gmail/Yahoo/etc. (tests temporaires uniquement)}';

    protected $description = 'Rattache les universités racines partageant le même nom (plusieurs domaines) au même campus principal.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $allowPublic = (bool) $this->option('allow-public-email-domains');

        $roots = University::query()
            ->whereNull('parent_university_id')
            ->orderBy('id')
            ->get();

        $grouped = $roots->groupBy(fn (University $u) => mb_strtolower(trim($u->name)));

        $did = false;

        foreach ($grouped as $key => $group) {
            if ($group->count() < 2) {
                continue;
            }

            $sorted = $group->sortBy('id')->values();
            $root = $sorted->first();

            if (! $allowPublic && $this->isPublicEmailDomain($root->domain)) {
                $this->warn("Ignoré « {$root->name} » : le campus principal (id={$root->id}) a un domaine grand public « {$root->domain} » — corrigez le nom de domaine à la main.");

                continue;
            }

            $this->info("Campus « {$root->name} » : principal id={$root->id} ({$root->domain})");

            foreach ($sorted->skip(1) as $alias) {
                if (! $allowPublic && $this->isPublicEmailDomain($alias->domain)) {
                    $this->warn("  ⊗ ignoré id={$alias->id} ({$alias->domain}) : domaine e-mail grand public — utilisez --allow-public-email-domains pour un test temporaire, ou : php artisan university:link-alias {$alias->id} {$root->id}");

                    continue;
                }

                $did = true;
                $this->line("  → domaine alias id={$alias->id} ({$alias->domain}) → parent id={$root->id}");

                if ($dryRun) {
                    continue;
                }

                $alias->update(['parent_university_id' => $root->id]);
                $alias->refresh();
                $alias->reassignLinkedDataToParent();
            }
        }

        if (! $did) {
            $this->info($dryRun
                ? 'Aucun groupe de plusieurs campus racines avec le même nom.'
                : 'Rien à faire : aucun doublon de nom parmi les campus racines.');

            return self::SUCCESS;
        }

        if ($dryRun) {
            $this->warn('Mode dry-run : aucune modification. Relancez sans --dry-run pour appliquer.');
        } else {
            $this->info('Terminé : domaines rattachés et données réassignées au campus principal.');
        }

        return self::SUCCESS;
    }

    private function isPublicEmailDomain(string $domain): bool
    {
        $d = mb_strtolower(trim($domain));

        return in_array($d, self::PUBLIC_EMAIL_DOMAINS, true);
    }
}
