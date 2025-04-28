<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ContactSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            PostSeeder::class,
            MediaSeeder::class,
            ConfigurationSeeder::class,
            ComponentSeeder::class,
            CommentSeeder::class,
            UserConfigurationSeeder::class,
        ]);
    }
}
