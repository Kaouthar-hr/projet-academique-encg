<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group; // Changé de Group à Groupe pour correspondre au modèle
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    public function createGroup(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'niveau' => 'required|string|max:255', // Ajouté car présent dans la migration
            'academic_year_id' => 'required|string',
            'filiere_id' => 'nullable|exists:filieres,id' // Ajouté car présent dans la migration
        ]);

        $group = Group::create($validated); // Changé Group en Group

        return response()->json([
            'message' => 'Groupe créé avec succès',
            'group' => $group->fresh()
        ], 201);
    }

    public function getAllGroups()
    {
        $groups = Group::withCount(['users', 'students', 'teachers'])
                     ->get();

        return response()->json($groups);
    }

    public function getMembers($groupId)
    {
        $group = Group::with(['users' => function($query) {
            $query->select('users.id', 'name', 'email')
                  ->withPivot('role');
        }])->findOrFail($groupId);

        return response()->json([
            'group' => $group,
            'members' => $group->users
        ]);
    }

    public function addMember(Request $request, $groupId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:enseignant,etudiant' // Correction de la faute de frappe "enseingant" à "enseignant"
        ]);

        $group = Group::findOrFail($groupId);
        
        // Vérifier si l'utilisateur est déjà dans le groupe
        if ($group->users()->where('user_id', $request->user_id)->exists()) {
            return response()->json([
                'message' => 'Cet utilisateur est déjà dans le groupe'
            ], 400);
        }

        $group->users()->attach($request->user_id, ['role' => $request->role]);

        return response()->json(['message' => 'Membre ajouté avec succès']);
    }

    public function removeMember(Request $request, $groupId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $group = Group::findOrFail($groupId);
        $group->users()->detach($request->user_id);

        return response()->json(['message' => 'Membre retiré avec succès']);
    }

    public function getStudents($groupId)
    {
        $students = Group::findOrFail($groupId)
                       ->students()
                       ->get(['users.id', 'name', 'email']);

        return response()->json($students);
    }

    public function getTeachers($groupId)
    {
        $teachers = Group::findOrFail($groupId)
                       ->teachers()
                       ->get(['users.id', 'name', 'email']);

        return response()->json($teachers);
    }
}