<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos
        $permissions = [
            'view-invoices',
            'upload-invoices',
            'manage-users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Asignar todos los permisos al admin
        $adminRole->givePermissionTo(Permission::all());

        // Asignar solo permisos de facturas al user
        $userRole->givePermissionTo(['view-invoices', 'upload-invoices']);

        // Asignar roles a usuarios existentes
        $adminUser = User::where('email', 'admin@equitylink.com')->first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
        }

        $testUser = User::where('email', 'test@equitylink.com')->first();
        if ($testUser) {
            $testUser->assignRole('user');
        }
    }
}
