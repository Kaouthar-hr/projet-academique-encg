<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inscription;
use App\Models\Filiere;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class InscriptionController extends Controller
{
    // Liste des inscriptions de l'utilisateur connecté
    public function allInscriptions()
    {
    
        $inscriptions = Inscription::with(['user', 'filiere'])->get();
        
    return $inscriptions->map(function ($inscription) {
        return [
            // Tous les champs existants...
            ...$inscription->toArray(),
            
            // Ajoutez ces deux URLs
            'photo_url' => $inscription->photo 
                ? asset('storage/'.$inscription->photo)
                : null,
            'bac_document_url' => $inscription->bac 
                ? asset('storage/'.$inscription->bac)
                : null
        ];
    });
    
        return response()->json($inscriptions);
    }

    // Créer une nouvelle demande d'inscription
    public function store(Request $request)
    {
        
    try {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }
        // Règles de validation de base
        $rules = [
            'type' => 'required|in:inscription,réinscription',
            'annee_universitaire' => 'required|string',
            'niveau' => 'required|in:1A,2A,3A,4A,5A',
            'bac' => 'required|file|mimes:pdf,jpeg,png,jpg|max:2048',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'sexe' => 'required|in:Homme,Femme',
            'nationaliter' => 'required|string',
            'cin' => 'required|string',
            'cne' => 'required|string',
            'nom_fr' => 'required|string',
            'prenom_fr' => 'required|string',
            'dateNaissance' => 'required|date',
            'telephone' => 'required|string',
            'adresse' => 'required|string',
        ];

        // Ajout des règles conditionnelles pour Marocains
        if ($request->nationaliter === 'Marocaine') {
            $rules['province'] = 'required|string';
            $rules['ville_libelle_stud'] = 'required|string';
        }

        // Validation
        $validatedData = $request->validate($rules);

            if ($user->role !== 'etudiant') {
                return response()->json(['message' => 'Seuls les étudiants peuvent s’inscrire.'], 403);
            }
    
            if (in_array($request->niveau, ['1A', '2A']) && $request->filled('filiere_id')) {
                return response()->json(['message' => 'Le choix de filière est réservé aux étudiants en 3A.'], 422);
            }
    
            if ($request->niveau === '3A' && !$request->filled('filiere_id')) {
                return response()->json(['message' => 'Le choix de filière est obligatoire en 3A.'], 422);
            }
    
            // Stockage des fichiers
            $bacDocumentPath = $request->file('bac')->store('bac', 'public');
            $photoPath = $request->file('photo')->store('photos_etudiants', 'public');
    
            // Création de l'inscription avec tous les champs
            $inscription = Inscription::create([
                'user_id' => $user->id,
                'type' => $request->type,
                'annee_universitaire' => $request->annee_universitaire,
                'niveau' => $request->niveau,
                'filiere_id' => $request->filiere_id,
                'statut' => 'en attente',
                'bac' => $bacDocumentPath,
                'photo' => $photoPath,
                'sexe' => $request->sexe,
                'nationaliter' => $request->nationaliter,
                'ville_libelle_stud' => $request->ville_libelle_stud ?? null,
                'province' => $request->province ?? null,
                'cin' => $request->cin,
                'cne' => $request->cne,
                'nom_fr' => $request->nom_fr,
                'nom_ar' => $request->nom_ar ?? null,
                'prenom_fr' => $request->prenom_fr,
                'prenom_ar' => $request->prenom_ar ?? null,
                'lieuNaissance_fr' => $request->lieuNaissance_fr ?? null,
                'lieuNaissance_ar' => $request->lieuNaissance_ar ?? null,
                'dateNaissance' => $request->dateNaissance,
                'paye_libelle' => $request->paye_libelle ?? null,
                'telephone' => $request->telephone,
                'situation_familiale' => $request->situation_familiale ?? null,
                'adresse' => $request->adresse,
                'cin_mere' => $request->cin_mere ?? null,
                'prenom_mere' => $request->prenom_mere ?? null,
                'nom_mere' => $request->nom_mere ?? null,
                'cinpere' => $request->cinpere ?? null,
                'prenompere' => $request->prenompere ?? null,
                'nompere' => $request->nompere ?? null,
                'adresseparent' => $request->adresseparent ?? null,
                'telparent' => $request->telparent ?? null,
                'professionpere' => $request->professionpere ?? null,
                'professionmere' => $request->professionmere ?? null,
                'mention_bac' => $request->mention_bac ?? null,
                'annee_bac' => $request->annee_bac ?? null,
                'lycee' => $request->lycee ?? null,
                'province_name' => $request->province_name ?? null,
                'universite' => $request->universite ?? null,
                'anneePremiereInscens' => $request->anneePremiereInscens ?? null,
                'lnscens' => $request->lnscens ?? null,
            ]);
    
            return response()->json([
                'message' => 'Inscription envoyée avec succès.',
                'inscription' => $inscription
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    

    //  Détail d'une inscription
    public function show($id)
    {
        $inscription = Inscription::with('filiere')->findOrFail($id);
        return response()->json($inscription);
    }

    //  Admin : valider ou refuser une inscription
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en attente,validée,refusée'
        ]);

        $inscription = Inscription::findOrFail($id);
        $inscription->statut = $request->statut;
        $inscription->save();

        return response()->json(['message' => 'Statut mis à jour.', 'inscription' => $inscription]);
    }

    // Récupérer les inscriptions de l'utilisateur connecté
public function mesInscriptions()
{
    $user = Auth::user();

    if ($user->role !== 'etudiant') {
        return response()->json(['message' => 'Seuls les étudiants peuvent accéder à leurs inscriptions.'], 403);
    }

    $inscriptions = Inscription::with('filiere')
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();

    return response()->json($inscriptions);
}

}

