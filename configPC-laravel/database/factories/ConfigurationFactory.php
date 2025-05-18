<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Configuration>
 */
class ConfigurationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_config' => $this->faker->name(),
            'title_config' => $this->faker->name(),
            'subtitle_config' => $this->faker->name(),
            'description_config' => $this->faker->text(),
            'explication_config' => $this->faker->text(),
            'image_config' => $this->faker->imageUrl(),
            'benchmark_config' => $this->faker->imageUrl(),
            'user_id' => $this->faker->numberBetween(1, User::count()),
            'is_published_config' => $this->faker->boolean()
        ];
    }
}
