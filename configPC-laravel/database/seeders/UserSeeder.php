<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@truc.fr'],
            [
                'nick_name' => 'Administrateur',
                'role' => 'ROLE_ADMIN',
                'email_verified_at' => now(),
                'password' => Hash::make('test123'),
                'remember_token' => Str::random(10)
            ]
        );
        User::factory()->create([
            'nick_name' => 'Editeur',
            'role' => 'ROLE_EDITOR',
            'email' => 'edit@truc.fr',
            'email_verified_at' => now(),
            'password' => Hash::make('test123'),
            'remember_token' => Str::random(10)
        ]);
        User::factory()->create([
            'nick_name' => 'Modérateur',
            'role' => 'ROLE_MODERATOR',
            'email' => 'modo@truc.fr',
            'email_verified_at' => now(),
            'password' => Hash::make('test123'),
            'remember_token' => Str::random(10)
        ]);
        User::create([
            'nick_name' => 'Utilisateur',
            'role' => 'ROLE_USER',
            'email' => 'user@truc.fr',
            'password' => Hash::make('test123'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10)
        ]);
        User::factory(10)->create();
    }
}
