<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Component>
 */
class ComponentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_component' => $this->faker->name(),
            'subtitle_component' => $this->faker->name(),
            'price_component' => $this->faker->randomFloat(2, 0, 999),
            'description_component' => $this->faker->text(),
            'consumption_component' => $this->faker->randomNumber(),
            'review_component' => $this->faker->text(),
            'image_component' => $this->faker->imageUrl(),
            'video_component' => $this->faker->url(),
            'release_date_component' => $this->faker->date(),
            'type_component' => $this->faker->name(),
            'category_id' => $this->faker->numberBetween(1, Category::count()),
            'brand_id' => $this->faker->numberBetween(1, Brand::count()),
        ];
    }
}
