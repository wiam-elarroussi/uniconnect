<?php

use App\Models\Post;
use App\Models\PostItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->string('kind', 20); // text | media
            $table->text('text')->nullable();
            $table->foreignId('post_media_id')->nullable()->constrained('post_media')->cascadeOnDelete();
            $table->timestamps();
        });

        if (! Schema::hasTable('posts')) {
            return;
        }

        Post::query()
            ->with('medias')
            ->orderBy('id')
            ->chunk(100, function ($posts) {
                foreach ($posts as $post) {
                    if (PostItem::query()->where('post_id', $post->id)->exists()) {
                        continue;
                    }
                    $p = 0;
                    if (is_string($post->body) && trim($post->body) !== '') {
                        PostItem::query()->create([
                            'post_id' => $post->id,
                            'position' => $p++,
                            'kind' => 'text',
                            'text' => $post->body,
                            'post_media_id' => null,
                        ]);
                    }
                    foreach ($post->medias as $m) {
                        PostItem::query()->create([
                            'post_id' => $post->id,
                            'position' => $p++,
                            'kind' => 'media',
                            'text' => null,
                            'post_media_id' => $m->id,
                        ]);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_items');
    }
};
