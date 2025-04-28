<?php

namespace App\Http\Controllers\API;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Component;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::paginate(10);
        return response()->json($brands->toArray()); 
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_brand' => 'required|string',
            'logo_brand' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            'description_brand' => 'required',
            'color_brand' => 'required|string',
        ]);
        $filename = "";
        if ($request->hasFile('logo_brand')) {
            $filenameWithExt = $request->file('logo_brand')->getClientOriginalName();
            $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('logo_brand')->getClientOriginalExtension();
            $filename = $filenameWithExt . '_' . time() . '.' . $extension;
            $request->file('logo_brand')->storeAs('uploads', $filename);
        } else {
            $filename = Null;
        }
        $formFields = $request->all();
        $formFields['logo_brand'] = $filename;
        Brand::create($formFields);
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        return response()->json($brand);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $formFields = $request->validate([
            'name_brand' => 'sometimes|string',
            'logo_brand' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'description_brand' => 'sometimes',
            'color_brand' => 'sometimes|string',
        ]);
        if ($request->hasFile('logo_brand')) {
            if ($brand->logo_brand && Storage::exists('uploads/' . $brand->logo_brand)) {
                Storage::delete('uploads/' . $brand->logo_brand);
            }
            $filenameWithExt = $request->file('logo_brand')->getClientOriginalName();
            $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('logo_brand')->getClientOriginalExtension();
            $filename = $filenameWithExt . '_' . time() . '.' . $extension;
            $request->file('logo_brand')->storeAs('uploads', $filename);
            $formFields['logo_brand'] = $filename;
        } else {
            $formFields['logo_brand'] = $brand->logo_brand; // Keep the old image
        }
        $brand->update($formFields);
        return response()->json([$brand, 'status' => 'Mise à jour effectuée avec succès']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        Component::where('brand_id', $brand->id)->delete();
        if ($brand->logo_brand && Storage::exists('uploads/' . $brand->logo_brand)) {
            Storage::delete('uploads/' . $brand->logo_brand);
        }
        $brand->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
