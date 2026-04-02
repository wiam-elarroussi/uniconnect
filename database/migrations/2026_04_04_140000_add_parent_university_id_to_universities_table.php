<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('universities', function (Blueprint $table) {
            $table->foreignId('parent_university_id')
                ->nullable()
                ->after('id')
                ->constrained('universities')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('universities', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_university_id');
        });
    }
};
