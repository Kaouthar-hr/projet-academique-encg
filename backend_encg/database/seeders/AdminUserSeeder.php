<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Premier admin
        User::updateOrCreate(
            ['email' => 'admin@encg.ma'],
            [
                'name' => 'Admin ENCG',
                'password' => Hash::make('passwordAdmin123'),
                'role' => 'admin'
            ]
        );

        // Deuxième admin
        User::updateOrCreate(
            ['email' => 'testadmin@encg.ma'],
            [
                'name' => 'Admin2 ENCG',
                'password' => Hash::make('cinadmin123'),
                'role' => 'admin'
            ]
        );
    }
}