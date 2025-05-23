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
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name_config', 100);
            $table->string('title_config');
            $table->string('subtitle_config');
            $table->text('description_config');
            $table->text('explication_config');
            $table->string('image_config', 100)->nullable();
            $table->string('benchmark_config', 100)->nullable();
            $table->foreignId('user_id')->constrained();
            $table->boolean('is_published_config')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
