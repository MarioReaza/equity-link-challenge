<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'=>'Admin User',
            'email'=>'admin@equitylink.com',
            'password'=> Hash::make('password')
        ]);

        User::create([
            'name'=> 'Test User',
            'email'=> 'test@equitylink.com',
            'password'=> Hash::make('password'),
        ]);
    }
}
