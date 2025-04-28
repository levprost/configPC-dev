<?php

namespace App\Http\Controllers\API;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Component;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ComponentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $term = $request->query('term','');
        $componentSearch = Component::search($term)->paginate(10);;
        $components = Component::all()->load(['category', 'brand']);
        return response()->json([
            'components' => $components,
            'componentSearch' => $componentSearch, 
        ]);
    }
    
    public function indexByCategory($category_id)
    {
        $components = Component::where('category_id', $category_id)->get()->load('brand');
        return response()->json([
            'components' => $components,
        ]);
    }
    public function indexByBrand($brand_id)
    {
        $components = Component::where('brand_id', $brand_id)->get()->load('category');
        return response()->json([
            'components' => $components,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $formFields = $request->validate([
            'name_component' => 'required|string',
            'subtitle_component' => 'required|string',
            'price_component' => 'required|numeric',
            'description_component' => 'required',
            'consumption_component' => 'required|integer',
            'review_component' => 'required',
            'image_component' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            'video_component' => 'nullable|string',
            'release_date_component' => 'required|date',
            'type_component' => 'required|string',
            'category_id' => 'required|integer',
            'brand_id' => 'required|integer',
        ]);
        $filename="";
        if ($request->hasFile('image_component')) {
            $filenameWithExt = $request->file('image_component')->getClientOriginalName();
            $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('image_component')->getClientOriginalExtension();
            $filename = $filenameWithExt . '_' . time() . '.' . $extension;
            $request->file('image_component')->storeAs('uploads', $filename);
        } else {
            $filename = Null;
        }
        $formFields['image_component'] = $filename;
        Component::create($formFields);
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Component $component)
    {
        $component->load(['brand', 'category']);

        return response()->json([
            'component' => $component
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Component $component)
    {
        $formFields = $request->validate([
            'name_component' => 'sometimes|string',
            'subtitle_component' => 'sometimes|string',
            'price_component' => 'sometimes|numeric',
            'description_component' => 'sometimes',
            'consumption_component' => 'sometimes|integer',
            'review_component' => 'sometimes',
            'image_component' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
            'video_component' => 'sometimes|string',
            'release_date_component' => 'sometimes|date',
            'type_component' => 'sometimes|string',
            'category_id' => 'sometimes|integer',
            'brand_id' => 'sometimes|integer',
        ]);
        if ($request->hasFile('image_component')) {
            if ($component->image_component && Storage::exists('uploads/' . $component->image_component)) {
                Storage::delete('uploads/' . $component->image_component);
            }
            $filenameWithExt = $request->file('image_component')->getClientOriginalName();
            $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('image_component')->getClientOriginalExtension();
            $filename = $filenameWithExt . '_' . time() . '.' . $extension;
            $request->file('image_component')->storeAs('uploads', $filename);
            $formFields['image_component'] = $filename;
        } else {
            $formFields['image_component'] = $component->image_component; // Keep the old image
        }
        $component->update($formFields);
        return response()->json([$component,'status' => 'Mise à jour effectuée avec succès']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Component $component)
    {
        $component->delete();
        if($component->image_component) {
            Storage::delete('uploads/' . $component->image_component);
        }
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
