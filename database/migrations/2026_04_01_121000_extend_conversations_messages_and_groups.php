<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->string('type', 16)->default('direct')->after('university_id');
            $table->string('title')->nullable()->after('type');
            $table->foreignId('created_by')->nullable()->after('title')->constrained('users')->nullOnDelete();
        });

        Schema::create('conversation_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['conversation_id', 'user_id']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->string('content_type', 16)->default('text')->after('sender_id');
            $table->string('media_path')->nullable()->after('body');
        });

        $this->backfillConversationMembers();
    }

    private function backfillConversationMembers(): void
    {
        $rows = DB::table('conversations')->select('id', 'user_one_id', 'user_two_id')->get();
        foreach ($rows as $c) {
            foreach ([$c->user_one_id, $c->user_two_id] as $uid) {
                if (! $uid) {
                    continue;
                }
                DB::table('conversation_user')->insertOrIgnore([
                    'conversation_id' => $c->id,
                    'user_id' => $uid,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['content_type', 'media_path']);
        });

        Schema::dropIfExists('conversation_user');

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn(['type', 'title', 'created_by']);
        });
    }
};
