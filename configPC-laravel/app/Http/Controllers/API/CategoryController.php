<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Component;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = Category::paginate(10);
        return response()->json($category->toArray());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_category' => 'required|string',
        ]);
        Category::create($request->all());
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $formFields = $request->validate([
            'name_category' => 'required|string',
        ]);
        $category->update($formFields);
        return response()->json([$category,'status' => 'Mise à jour effectuée avec succès']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        Component::where('category_id', $category->id)->delete();
        $category->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
