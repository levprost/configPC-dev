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
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->string('name_component');
            $table->string('subtitle_component')->nullable();
            $table->decimal('price_component');
            $table->text('description_component');
            $table->integer('consumption_component');
            $table->text('review_component');
            $table->string('image_component', 100)->nullable();
            $table->string('video_component')->nullable();
            $table->date('release_date_component');
            $table->string('type_component', 100)->nullable();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('brand_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('components');
    }
};
