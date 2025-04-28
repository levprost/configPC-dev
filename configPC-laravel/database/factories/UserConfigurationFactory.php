<?php

namespace Database\Factories;


use App\Models\Configuration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserConfiguration>
 */
class UserConfigurationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'comment_favorite' => $this->faker->text(),
            'rating_favorite' => $this->faker->numberBetween(1, 5),
            'user_id' => $this->faker->numberBetween(1, User::count()),
            'configuration_id' => $this->faker->numberBetween(1, Configuration::count()),
        ];
    }
}
