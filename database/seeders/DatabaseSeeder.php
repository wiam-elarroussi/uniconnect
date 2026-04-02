<?php

namespace Database\Seeders;

use App\Models\University;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Super-admin global : définissez SUPER_ADMIN_EMAIL et SUPER_ADMIN_PASSWORD dans .env
     * (ou utilisez les valeurs par défaut ci-dessous uniquement en développement).
     * Connexion : même page /login ; redirection automatique vers /super-admin si role = super_admin.
     *
     * Admin d'université : créez le compte via le super-admin (interface) avec role admin + université,
     * ou ajoutez un User avec role=admin et university_id correspondant.
     */
    public function run(): void
    {
        University::firstOrCreate(
            ['domain' => 'supmti.ma'],
            ['name' => 'SupMTI', 'is_active' => true]
        );

        $superEmail = env('SUPER_ADMIN_EMAIL', 'superadmin@uniconnect.local');
        $superPassword = env('SUPER_ADMIN_PASSWORD', 'ChangeMeSuperAdmin!');

        User::firstOrCreate(
            ['email' => $superEmail],
            [
                'name' => 'Super administrateur',
                'password' => Hash::make($superPassword),
                'role' => 'super_admin',
                'university_id' => null,
                'email_verified_at' => now(),
                'requires_email_verification' => false,
            ]
        );
    }
}
