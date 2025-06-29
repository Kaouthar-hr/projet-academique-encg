<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inscription; // Supposons que vous avez ce modèle
use PDF;
use Illuminate\Support\Facades\Log;


class RecuController extends Controller
{
    public function generate($id)
    {
        try {
            $inscription = Inscription::with('user')->findOrFail($id);
            
            $data = [
                'inscription' => $inscription,
                'date' => now()->format('d/m/Y'),
            ];
            
            $pdf = PDF::loadView('pdf.recu', $data);
            return $pdf->download("recu_inscription_{$id}.pdf");
            
        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur de génération'], 500);
        }
    }
}