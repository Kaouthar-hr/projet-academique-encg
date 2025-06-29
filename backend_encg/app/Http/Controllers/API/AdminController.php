<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admis;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Importe un fichier CSV de CNE admis
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadAdmis(Request $request)
    {
        // Validation du fichier
        $validated = $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048' // 2MB max
        ]);

        try {
            $file = $request->file('file');
            $path = $file->getRealPath();
            $importedCount = 0;
            $duplicatesCount = 0;
            $invalidEntries = 0;

            if (($handle = fopen($path, 'r')) !== FALSE) {
                while (($data = fgetcsv($handle)) !== FALSE) {
                    // Nettoyage et validation du CNE
                    $cne = trim($data[0] ?? '');
                    
                    if (empty($cne)) {
                        $invalidEntries++;
                        continue;
                    }

                    // Vérification du format du CNE (exemple: au moins 5 caractères)
                    if (strlen($cne) < 5) {
                        $invalidEntries++;
                        continue;
                    }

                    // Création ou mise à jour
                    $result = Admis::firstOrCreate(
                        ['cne' => $cne],
                        ['cne' => $cne]
                    );

                    $result->wasRecentlyCreated ? $importedCount++ : $duplicatesCount++;
                }
                fclose($handle);
            }

            // Journalisation pour le débogage
            Log::info('Import CNE terminé', [
                'imported' => $importedCount,
                'duplicates' => $duplicatesCount,
                'invalid' => $invalidEntries,
                'user' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Importation terminée avec succès',
                'data' => [
                    'imported' => $importedCount,
                    'duplicates' => $duplicatesCount,
                    'invalid_entries' => $invalidEntries
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'import CNE', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'user' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'importation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Liste tous les CNE admis (optionnel)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listAdmis()
    {
        try {
            $admis = Admis::all()->pluck('cne');

            return response()->json([
                'success' => true,
                'count' => $admis->count(),
                'data' => $admis
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données'
            ], 500);
        }
    }
}