<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDisplayName implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $value === '') {
            return;
        }

        $lower = mb_strtolower($value, 'UTF-8');

        $forbidden = [
            'admin',
            'administrateur',
            'administration',
            'moderateur',
            'modérateur',
            'moderation',
            'modération',
            'root',
            'support',
            'superadmin',
            'super-admin',
        ];

        foreach ($forbidden as $word) {
            if (str_contains($lower, $word)) {
                $fail('Ce nom contient un terme réservé (ex. admin, modération, support). Choisissez un autre nom d’affichage.');

                return;
            }
        }
    }
}
