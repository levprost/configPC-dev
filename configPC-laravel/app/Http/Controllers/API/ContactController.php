<?php

namespace App\Http\Controllers\API;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::paginate(10);
        return response()->json($contacts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $formFields = $request->validate([
            'subject_contact' => 'required|string',
            'email_contact' => 'required|email',
            'message_contact' => 'required',
            'image_contact' => 'sometimes|image',
        ]);
        $filename = "";
    if ($request->hasFile('image_contact')) {
      // On récupère le nom du fichier avec son extension, résultat $filenameWithExt : "jeanmiche.jpg" 
      $filenameWithExt = $request->file('image_contact')->getClientOriginalName();
      $filenameWithExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
      // On récupère l'extension du fichier, résultat $extension : ".jpg" 
      $extension = $request->file('image_contact')->getClientOriginalExtension();
      // On créer un nouveau fichier avec le nom + une date + l'extension, résultat $filename :"jeanmiche_20220422.jpg" 
      $filename = $filenameWithExt . '_' . time() . '.' . $extension;
      // On enregistre le fichier à la racine /storage/app/public/uploads, ici la méthode storeAs défini déjà le chemin 
      ///storage/app 
      $request->file('image_contact')->storeAs('uploads', $filename);
    } else {
      $filename = Null;
    }
        $formFields['image_contact'] = $filename;
        Contact::create($formFields);
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return response()->json($contact);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        if($contact->image_contact) {
            Storage::delete('uploads/' . $contact->image_contact);
        }
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
