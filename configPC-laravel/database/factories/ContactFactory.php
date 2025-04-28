<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_contact' => $this->faker->name(),
            'email_contact' => $this->faker->email(),
            'message_contact' => $this->faker->text(),
            'image_contact' => $this->faker->imageUrl(),
        ];
    }
}
