<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Comptes déjà en base : pas d’obligation de vérifier l’email à la connexion.
     * Nouveaux comptes (inscription) : requires_email_verification = true (défini dans RegisteredUserController).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('requires_email_verification')->default(false)->after('email_verified_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('requires_email_verification');
        });
    }
};
