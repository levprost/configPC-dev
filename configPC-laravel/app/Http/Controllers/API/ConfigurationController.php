<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Component;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Models\UserConfiguration;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $configurations = Configuration::with(['user', 'userConfiguration'])->paginate(10);
        return response()->json($configurations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'name_config' => 'required|string',
        'title_config' => 'required|string',
        'subtitle_config' => 'required|string',
        'description_config' => 'required',
        'explication_config' => 'required',
        'image_config' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        'benchmark_config' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        'user_id' => 'required|integer',
        'components.*' => 'integer|exists:components,id'
    ]);

    $filename = null;
    if ($request->hasFile('image_config')) {
        $filenameWithExt = $request->file('image_config')->getClientOriginalName();
        $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        $extension = $request->file('image_config')->getClientOriginalExtension();
        $filename = $filenameWithExt . '_' . time() . '.' . $extension;
        $request->file('image_config')->storeAs('uploads', $filename);
    }

    $filenameBenchmark = null;
    if ($request->hasFile('benchmark_config')) {
        $filenameWithExt = $request->file('benchmark_config')->getClientOriginalName();
        $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        $extension = $request->file('benchmark_config')->getClientOriginalExtension();
        $filenameBenchmark = $filenameWithExt . '_' . time() . '.' . $extension;
        $request->file('benchmark_config')->storeAs('uploads', $filenameBenchmark);
    }

    $configuration = Configuration::create([
        'name_config' => $request->name_config,
        'title_config' => $request->title_config,
        'subtitle_config' => $request->subtitle_config,
        'description_config' => $request->description_config,
        'explication_config' => $request->explication_config,
        'image_config' => $filename,
        'benchmark_config' => $filenameBenchmark,
        'user_id' => $request->user_id
    ]);


    
    $configuration->components()->attach($request->components);

    return response()->json([
        'status' => 'Création effectuée avec succès',
        'configuration' => $configuration->load('components') // Загружаем компоненты в ответе
    ]);
}


    /**
     * Display the specified resource.
     */
    public function show(Configuration $configuration)
{
    //  Récupérer le score de la configuration spécifique
    // On sélectionne l'ID de la configuration, le nombre total de votes et la moyenne des notes (rating_favorite)
    $score = UserConfiguration::query()
        ->selectRaw('configuration_id, COUNT(rating_favorite) as total_score, AVG(rating_favorite) as avg_score')
        ->where('configuration_id', $configuration->id) // Filtrer par l'ID de la configuration reçue en paramètre
        ->groupBy('configuration_id') // Grouper les résultats par configuration pour éviter les doublons
        ->get(); 

    //  Trier les scores par ordre décroissant de la moyenne et récupérer le meilleur score pour cette configuration
    $noteConfiguration = $score->sortByDesc('avg_score')->where('configuration_id', $configuration->id)->first();

    $ratings = UserConfiguration::query()
        ->select('user_configurations.*', 'users.nick_name') // Sélectionner toutes les colonnes de user_configurations + le nom d'utilisateur
        ->join('users', 'users.id', '=', 'user_configurations.user_id') // Joindre la table users pour récupérer le pseudo (nick_name)
        ->where('user_configurations.configuration_id', $configuration->id) // Filtrer par l'ID de la configuration actuelle (corrected table name)
        ->get();
           
    return response()->json([
        'configuration' => $configuration->load('components'), // Informations de la configuration
        'noteConfiguration' => $noteConfiguration, // Score le plus élevé basé sur la moyenne des notes
        'score' => $score, // Liste des scores
        'ratings' => $ratings, // Liste des évaluations avec commentaires et pseudos
    ]);
}




    /**
     * Update the specified resource in storage.
     */

     public function update(Request $request, Configuration $configuration)
     {
         // First validate non-file fields
         $formFields = $request->validate([
             'name_config' => 'sometimes|string',
             'title_config' => 'sometimes|string',
             'subtitle_config' => 'sometimes|string',
             'description_config' => 'sometimes',
             'explication_config' => 'sometimes',
             'user_id' => 'sometimes|integer',
         ]);
         
         // Handle image_config file upload
         if ($request->hasFile('image_config')) {
             $request->validate([
                 'image_config' => 'image|mimes:jpeg,png,jpg,gif,svg',
             ]);
             
             if ($configuration->image_config && Storage::exists('uploads/' . $configuration->image_config)) {
                 Storage::delete('uploads/' . $configuration->image_config);
             }
             
             $filename = time() . '_' . $request->file('image_config')->getClientOriginalName();
             $request->file('image_config')->storeAs('uploads', $filename);
             $formFields['image_config'] = $filename;
         }
         
         // Handle benchmark_config file upload
         if ($request->hasFile('benchmark_config')) {
             $request->validate([
                 'benchmark_config' => 'image|mimes:jpeg,png,jpg,gif,svg',
             ]);
             
             if ($configuration->benchmark_config && Storage::exists('uploads/' . $configuration->benchmark_config)) {
                 Storage::delete('uploads/' . $configuration->benchmark_config);
             }
             
             $filenameBenchmark = time() . '_' . $request->file('benchmark_config')->getClientOriginalName();
             $request->file('benchmark_config')->storeAs('uploads', $filenameBenchmark);
             $formFields['benchmark_config'] = $filenameBenchmark;
         }
         
         $configuration->update($formFields);
         
         return response()->json([
             $configuration,
             'status' => 'Mise à jour effectuée avec succès',
         ]);
     }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Configuration $configuration)
    {
        $configuration->delete();
        $UserConfigration = UserConfiguration::where('configuration_id', $configuration->id);
        $UserConfigration->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
