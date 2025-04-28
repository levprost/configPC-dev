<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserConfiguration;
use Illuminate\Http\Request;

class UserConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userConfigurations = UserConfiguration::all();
        return response()->json($userConfigurations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $formFields = $request->validate([
            'comment_favorite' => 'nullable|string',
            'rating_favorite' => 'required|numeric|min:1|max:5',
            'configuration_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);
        if(UserConfiguration::where('user_id', $formFields['user_id'])->where('configuration_id', $formFields['configuration_id'])->exists()){
            return response()->json([
                'status' => 'Configuration déjà existante'
            ]);
        }
        UserConfiguration::create($formFields);
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserConfiguration $userConfiguration)
    {
        return response()->json($userConfiguration);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserConfiguration $userConfiguration)
    {
        $formFields = $request->validate([
            'comment_favorite' => 'sometimes|string',
            'rating_favorite' => 'required|numeric',
        ]);
        $userConfiguration->update($formFields);
        return response()->json([
            'status' => 'Mise à jour effectuée avec succès'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserConfiguration $userConfiguration)
    {
        $userConfiguration->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
