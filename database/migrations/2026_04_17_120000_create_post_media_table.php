<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        if (Schema::hasTable('posts')) {
            $rows = DB::table('posts')
                ->whereNotNull('media_path')
                ->select('id', 'media_path')
                ->get();

            foreach ($rows as $p) {
                if ($p->media_path) {
                    DB::table('post_media')->insert([
                        'post_id' => $p->id,
                        'path' => $p->media_path,
                        'position' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('post_media');
    }
};
