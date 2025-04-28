<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_brand' => $this->faker->name(),
            'logo_brand' => $this->faker->imageUrl(),
            'description_brand' => $this->faker->text(),
            'color_brand' => $this->faker->hexColor(),
        ];
    }
}
