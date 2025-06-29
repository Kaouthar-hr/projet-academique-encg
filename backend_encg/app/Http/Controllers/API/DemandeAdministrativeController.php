<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DemandeAdministrative;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DemandeAdministrativeController extends Controller
{
    //  Étudiant - Créer une demande
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:certificat_scolarite,attestation_inscription',
            'message' => 'nullable|string',
        ]);

        $demande = DemandeAdministrative::create([
            'user_id' => Auth::id(),
            'type' => $request->type,
            'message' => $request->message,
            'status' => 'en_attente',
        ]);

        return response()->json(['message' => 'Demande envoyée avec succès', 'demande' => $demande], 201);
    }

    //  Étudiant - Voir ses demandes
    public function myRequests()
    {
        $demandes = DemandeAdministrative::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        if ($demandes->isEmpty()) {
            return response()->json(['message' => 'Aucune demande pour l’instant.'], 200);
        }
        return response()->json($demandes);
    }

    //  Admin - Voir toutes les demandes
    public function index()
    {
        $demandes = DemandeAdministrative::with('user')->orderBy('created_at', 'desc')->get();
        if ($demandes->isEmpty()) {
            return response()->json(['message' => 'Aucune demande pour l’instant.'], 200);
        }
        return response()->json($demandes);
    }

    //  Admin - Valider ou refuser une demande
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:validee,refusee',
            'admin_comment' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $demande = DemandeAdministrative::findOrFail($id);
        $demande->status = $request->status;
        $demande->admin_comment = $request->admin_comment;

        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('documents', 'public');
            $demande->document_path = $path;
        }

        $demande->save();

        return response()->json(['message' => 'Demande mise à jour avec succès', 'demande' => $demande]);
    }
}

