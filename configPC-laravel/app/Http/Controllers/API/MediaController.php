<?php

namespace App\Http\Controllers\API;

use App\Models\Media;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $media = Media::paginate(10);
        return response()->json($media);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate incoming data
    $formFields = $request->validate([
        'media_file.*' => 'required|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'media_type.*' => 'required|string',
        'post_id' => 'required|integer|exists:posts,id',
    ]);

    // Array to store saved media files
    $savedMedia = [];

    // Check if files are uploaded
    if ($request->hasFile('media_file')) {
        // Check if the folder exists, if not, create it
        if (!Storage::exists('uploads')) {
            Storage::makeDirectory('uploads');
        }

        // Upload files
        foreach ($request->file('media_file') as $index => $file) {
            // Get the original file name and its extension
            $filenameWithExt = $file->getClientOriginalName();
            $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = $filenameWithExt . '_' . time() . '.' . $extension;

            // Save the file in the 'uploads' directory
            $filePath = $file->storeAs('uploads', $filename);

            // Create a record in the database for the media file
            $media = new Media();
            $media->post_id = $formFields['post_id'];
            $media->media_file = $filename; // Save the file name
            $media->media_type = $formFields['media_type'][$index]; // Media type (from array)
            $media->save();

            // Add the media to the array for returning or further use
            $savedMedia[] = $media;
        }
    }

    // Return a response with a success status and the saved media data
    return response()->json([
        'status' => 'Media added successfully',
        'data' => $savedMedia // Return the saved media
    ]);
}


    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        return response()->json($media);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request)
    {
        // Validation des données entrantes
        $formFields = $request->validate([
            'media_file.*' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif,svg', // Les fichiers doivent être des images valides
            'media_type'   => 'required|string', // Type de média obligatoire
            'post_id'      => 'required|integer|exists:posts,id', // Vérifie que post_id existe dans la table posts
        ]);

        // Récupération des médias existants pour ce post
        $oldMedia = Media::where('post_id', $formFields['post_id'])->get();

        if ($request->hasFile('media_file')) {
            // Si de nouveaux fichiers sont fournis, nous devons supprimer les anciens fichiers
            foreach ($oldMedia as $media) {
                if ($media->media_file && Storage::exists('uploads/' . $media->media_file)) {
                    Storage::delete('uploads/' . $media->media_file); // Supprime le fichier de stockage
                }
                $media->delete(); // Supprime l'entrée de la base de données
            }

            // Parcourir chaque fichier téléchargé
            foreach ($request->file('media_file') as $file) {
                // Générer un nom unique pour chaque fichier
                $filenameBase = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $filename = $filenameBase . '_' . time() . '.' . $extension;

                // Stocker le fichier dans le dossier 'uploads'
                $file->storeAs('uploads', $filename);

                // Créer une nouvelle entrée dans la base de données
                Media::create([
                    'media_file' => $filename,
                    'media_type' => $formFields['media_type'],
                    'post_id'    => $formFields['post_id'],
                ]);
            }
        } else {
            // Si aucun fichier n'est fourni, on met seulement à jour le type de média
            foreach ($oldMedia as $media) {
                $media->update([
                    'media_type' => $formFields['media_type'] // Mise à jour du type de média
                ]);
            }
        }

        return response()->json([
            'status' => 'Mise à jour effectuée avec succès' // Retourne un message de succès
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $medium)
    {
        if ($medium->media_file && Storage::exists('uploads/' . $medium->media_file)) {
            Storage::delete('uploads/' . $medium->media_file);
        }
        
        $medium->delete();
        return response()->json('Media supprimé');
    }
}
