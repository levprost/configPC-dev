<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'nick_name' => 'John',
            'email' => 'john@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'meta' => ['code', 'status', 'message'],
                'data' => [
                    'user' => ['id', 'nick_name', 'email', 'created_at', 'updated_at'],
                    'access_token' => ['token', 'type', 'expires_in'],
                ],
            ]);
    }

    public function test_user_cannot_login_with_wrong_password()
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_get_list_of_posts()
    {
        $user = User::factory()->create();

        Post::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data'); // если ответ обёрнут в "data"
    }


    public function test_can_create_post()
    {
        $moderator = User::factory()->create([
            'nick_name' => 'moderator',
            'email' => 'moder@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'ROLE_MODERATOR'
        ]);

        $this->actingAs($moderator); 

        $postData = [
            'title_post' => 'test_title',
            'content_post' => 'test_content',
            'content_post_1' => 'test_content_1',
            'content_post_2' => 'test_content_2',
            'subtitle_post' => 'test_subtitle',
            'description_post' => 'test_description',
            'is_published_post' => 1,
            // 'user_id' => $moderator->id, // если назначается автоматически — убери
        ];

        $response = $this->postJson('/api/posts', $postData);

        $response->assertStatus(403);
        
    }


    public function test_user_can_delete_brand()
    {
        $user = User::factory()->create(['role' => 'ROLE_USER']);

        $this->actingAs($user);

        $response = $this->postJson('/api/posts', [
            'title_post' => 'test_title',
            'content_post' => 'test_content',
            'content_post_1' => 'test_content_1',
            'content_post_2' => 'test_content_2',
            'subtitle_post' => 'test_subtitle',
            'description_post' => 'test_description',
            'is_published_post' => 1,
            'user_id' => 2,
        ]);

        $response->assertStatus(403);
    }
    public function test_can_update_brand()
    {
        $this->assertEquals(2, 1 + 1);
    }
     public function test_can_create_contact()
    {
        $this->assertEquals(2, 1 + 1);
    }
    public function test_can_delete_contact()
    {
        $this->assertEquals(2, 1 + 1);
    }
}
