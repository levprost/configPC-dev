<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title_post' => $this->faker->name(),
            'content_post' => $this->faker->text(),
            'content_post_1' => $this->faker->text(),
            'content_post_2' => $this->faker->text(),
            'subtitle_post' => $this->faker->name(),
            'description_post' => $this->faker->text(),
            'is_published_post' => $this->faker->boolean(),
            'user_id' => User::all()->random()->id,
        ];
    }
}
