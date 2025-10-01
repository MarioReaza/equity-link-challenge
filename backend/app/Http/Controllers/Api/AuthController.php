<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    # Login de usuario
    public function login(Request $request){
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Las credenciales proporcionadas son incorrectas.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    $user->load(['roles', 'permissions']);

    return response()->json([
        'user' => $user,
        'token' => $token,
        'permissions' => $user->getAllPermissions()->pluck('name'),
        'roles' => $user->getRoleNames(),
        'message' => 'Login exitoso'
    ], 200);
}

    # Logout de usuario
    public function logout (Request $request){
        $request -> user()->currentAccessToken()->delete();

        return response()->json([
            'message'=> 'Sesion cerrada exitosamente'
        ], 200);

    }

    # Conseguir usuario autenticado
    public function user(Request $request){
    $user = $request->user()->load(['roles', 'permissions']);

    return response()->json([
        'user' => $user,
        'permissions' => $user->getAllPermissions()->pluck('name'),
        'roles' => $user->getRoleNames(),
    ], 200);
}

    # Registrar usuario
    public function register(Request $request){
        $request->validate([
            'name'=> 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Usuario registrado exitosamente'
        ],201);
    }
}
