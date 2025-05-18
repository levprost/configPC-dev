<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::factory(30)->create();
        Post::factory()->create([
            'title_post' => 'test_title',
            'content_post' => 'test_content',
            'content_post_1' => 'test_content_1',
            'content_post_2' => 'test_content_2',
            'subtitle_post' => 'test_subtitle',
            'description_post' => 'test_description',
            'is_published_post' => 1,
            'user_id' => 2,
        ]);
    }
}
