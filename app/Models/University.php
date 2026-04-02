<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $fillable = [
        'name',
        'domain',
        'is_active',
        'parent_university_id',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_university_id');
    }

    /** Domaines e-mail supplémentaires rattachés au même campus (même admin). */
    public function domainAliases(): HasMany
    {
        return $this->hasMany(self::class, 'parent_university_id');
    }

    /** ID utilisé pour users / posts / modération (campus principal). */
    public function canonicalId(): int
    {
        return $this->parent_university_id ?? $this->id;
    }

    /** Campus « racine » (sans parent) — pour listes déroulantes admin. */
    public function scopeRootCampuses($query)
    {
        return $query->whereNull('parent_university_id');
    }

    /**
     * Déplace users / posts / canaux / ressources de ce domaine (alias) vers l’ID parent.
     */
    public function reassignLinkedDataToParent(): void
    {
        if ($this->parent_university_id === null) {
            return;
        }

        $parentId = $this->parent_university_id;
        $id = $this->id;

        User::where('university_id', $id)->update(['university_id' => $parentId]);
        Post::where('university_id', $id)->update(['university_id' => $parentId]);
        Channel::where('university_id', $id)->update(['university_id' => $parentId]);
        Resource::where('university_id', $id)->update(['university_id' => $parentId]);
    }
}
