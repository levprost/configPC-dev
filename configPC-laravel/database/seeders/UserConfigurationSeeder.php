<?php

namespace Database\Seeders;

use App\Models\UserConfiguration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserConfiguration::factory(10)->create();
    }
}
