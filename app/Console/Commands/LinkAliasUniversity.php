<?php

namespace App\Console\Commands;

use App\Models\University;
use Illuminate\Console\Command;

class LinkAliasUniversity extends Command
{
    protected $signature = 'university:link-alias
                            {child : ID de la ligne « domaine supplémentaire »}
                            {parent : ID du campus principal (racine)}';

    protected $description = 'Définit parent_university_id sur une ligne et réassigne users/posts/canaux/ressources (y compris domaine « grand public » pour tests temporaires).';

    public function handle(): int
    {
        $childId = (int) $this->argument('child');
        $parentId = (int) $this->argument('parent');

        if ($childId === $parentId) {
            $this->error('child et parent doivent être différents.');

            return self::FAILURE;
        }

        $child = University::query()->find($childId);
        $parent = University::query()->find($parentId);

        if (! $child || ! $parent) {
            $this->error('Université introuvable.');

            return self::FAILURE;
        }

        if ($parent->parent_university_id !== null) {
            $this->error('Le parent doit être un campus racine (sans parent_university_id).');

            return self::FAILURE;
        }

        if ($child->domainAliases()->exists()) {
            $this->error('La ligne « enfant » a déjà des domaines rattachés : supprimez-les d’abord.');

            return self::FAILURE;
        }

        $child->update(['parent_university_id' => $parentId]);
        $child->refresh();
        $child->reassignLinkedDataToParent();

        $this->info("OK : {$child->domain} (id={$child->id}) → parent {$parent->name} (id={$parent->id}).");

        return self::SUCCESS;
    }
}
