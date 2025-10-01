<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
     // Obtener a todos los usuarios y sus permisos
    public function index()
    {
        $users = User::with(['roles', 'permissions'])->get();
        return response()->json(['users' => $users], 200);
    }

    // Crear nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->role) {
            $user->assignRole($request->role);
        }

        return response()->json([
            'user' => $user->load(['roles', 'permissions']),
            'message' => 'Usuario creado exitosamente'
        ], 201);
    }

    // Actualizar usuario
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
        ]);

        $user->update($request->only(['name', 'email']));

        if ($request->password) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return response()->json([
            'user' => $user->load(['roles', 'permissions']),
            'message' => 'Usuario actualizado exitosamente'
        ], 200);
    }

    // Borrar usuario
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado exitosamente'], 200);
    }

    // Asignar permisos a usuario
    public function assignPermissions(Request $request, User $user)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user->syncPermissions($request->permissions);

        return response()->json([
            'user' => $user->load(['roles', 'permissions']),
            'message' => 'Permisos asignados exitosamente'
        ], 200);
    }

    // Asignar rol a usuario
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->syncRoles([$request->role]);

        return response()->json([
            'user' => $user->load(['roles', 'permissions']),
            'message' => 'Rol asignado exitosamente'
        ], 200);
    }

    // Obtener todos los permisos
    public function permissions()
    {
        $permissions = Permission::all();
        return response()->json(['permissions' => $permissions], 200);
    }

    // Obtener todos los roles
    public function roles()
    {
        $roles = Role::with('permissions')->get();
        return response()->json(['roles' => $roles], 200);
    }
}
