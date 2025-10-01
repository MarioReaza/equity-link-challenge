<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\InvoiceController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rutas de administración de usuarios (requiere permiso manage-users)
    Route::middleware('permission:manage-users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::post('/users/{user}/permissions', [UserController::class, 'assignPermissions']);
        Route::post('/users/{user}/role', [UserController::class, 'assignRole']);
    });

    // Obtener permisos y roles disponibles
    Route::get('/permissions', [UserController::class, 'permissions']);
    Route::get('/roles', [UserController::class, 'roles']);

    // Rutas de facturas (requiere permiso view-invoices)
    Route::middleware('permission:view-invoices')->group(function () {
        Route::get('/invoices', [InvoiceController::class, 'index']);
    });

    // Subir factura (requiere permiso upload-invoices)
    Route::middleware('permission:upload-invoices')->group(function () {
        Route::post('/invoices', [InvoiceController::class, 'store']);
    });

    // Eliminar factura (requiere ser el propietario)
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy']);
});
