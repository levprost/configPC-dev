<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title_post');
            $table->text('content_post');
            $table->text('content_post_1');
            $table->text('content_post_2');
            $table->string('subtitle_post');
            $table->text('description_post');
            $table->boolean('is_published')->default(false);
            $table->integer('order_post')->nullable();
            $table->foreignId('user_id')->constrained();	
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    
    {
        Schema::dropIfExists('posts');
    }
};
