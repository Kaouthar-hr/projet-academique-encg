<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;

class ModuleController extends Controller
{
    public function index(Request $request)
{
    // Si un semestre est spécifié dans la requête, filtrer les modules
    if ($request->has('semestre')) {
        $semestre = $request->query('semestre');
        return response()->json(Module::where('semestre', $semestre)->get());
    }
    
    // Sinon, retourner tous les modules
    return response()->json(Module::all());
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'intitule' => 'required|string',
            'coefficient' => 'required|numeric',
            'volume_horaire' => 'required|integer',
            'semestre' => 'required|string',
        ]);

        $module = Module::create($validated);
        return response()->json($module, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'intitule' => 'required|string',
            'coefficient' => 'required|numeric',
            'volume_horaire' => 'required|integer',
            'semestre' => 'required|string',
        ]);

        $module = Module::find($id);
        if (!$module) {
            return response()->json(['message' => 'Module non trouvé'], 404);
        }

        $module->update($validated);
        return response()->json($module);
    }

    public function destroy($id)
    {
        $module = Module::find($id);
        if (!$module) {
            return response()->json(['message' => 'Module non trouvé'], 404);
        }

        $module->delete();
        return response()->json(['message' => 'Module supprimé']);
    }
}
