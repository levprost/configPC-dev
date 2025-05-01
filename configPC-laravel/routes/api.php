<?php

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Models\UserConfiguration;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\BrandController;
use App\Http\Controllers\API\MediaController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ComponentController;
use App\Http\Controllers\API\ConfigurationController;
use App\Http\Controllers\API\UserConfigurationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource("brands", BrandController::class);
Route::apiResource("categories", CategoryController::class);
Route::apiResource("comments", CommentController::class);
Route::apiResource("media", MediaController::class);
Route::apiResource("configurations", ConfigurationController::class);
Route::apiResource("contacts", ContactController::class);
Route::apiResource("UserConfigurations", UserConfigurationController::class);


//==============================POST==============================
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/last', [PostController::class, 'last']);
Route::get('posts/published', [PostController::class, 'indexPublished']);
Route::get('/posts/order', [PostController::class, 'indexOrder']);
Route::get('/posts/home', [PostController::class, 'indexHome']); 
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

//==============================COMPONENT==============================
Route::get('/components', [ComponentController::class, 'index']);
Route::get('/components/category/{category_id}', [ComponentController::class, 'indexByCategory']);
Route::get('/components/brand/{brand_id}', [ComponentController::class, 'indexByBrand']);
Route::post('/components', [ComponentController::class, 'store']);
Route::get('/components/{component}', [ComponentController::class, 'show']);
Route::put('/components/{component}', [ComponentController::class, 'update']);
Route::delete('/components/{component}', [ComponentController::class, 'destroy']);

//================================USER==============================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); 
Route::middleware('auth:api')->group(function() { 
    Route::get('/currentuser', [UserController::class, 'currentUser']); 
    Route::post('/logout', [AuthController::class, 'logout']); 

});