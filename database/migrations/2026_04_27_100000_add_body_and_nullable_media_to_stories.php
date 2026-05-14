<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->text('body')->nullable()->after('university_id');
        });

        Schema::table('stories', function (Blueprint $table) {
            $table->string('media_path')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn('body');
        });

        DB::table('stories')->whereNull('media_path')->orWhere('media_path', '')->delete();
        Schema::table('stories', function (Blueprint $table) {
            $table->string('media_path')->nullable(false)->change();
        });
    }
};
