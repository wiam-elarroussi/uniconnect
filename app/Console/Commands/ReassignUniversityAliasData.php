<?php

namespace App\Console\Commands;

use App\Models\University;
use Illuminate\Console\Command;

class ReassignUniversityAliasData extends Command
{
    protected $signature = 'university:reassign-alias-data';

    protected $description = 'Déplace users/posts/canaux/ressources des lignes « domaine alias » vers le campus parent (parent_university_id).';

    public function handle(): int
    {
        $aliases = University::query()->whereNotNull('parent_university_id')->get();

        if ($aliases->isEmpty()) {
            $this->info('Aucune université avec parent_university_id.');

            return self::SUCCESS;
        }

        foreach ($aliases as $u) {
            $u->reassignLinkedDataToParent();
            $this->line("Rattaché : {$u->domain} → parent #{$u->parent_university_id}");
        }

        $this->info('Terminé.');

        return self::SUCCESS;
    }
}
