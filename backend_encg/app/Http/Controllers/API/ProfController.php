<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProfController extends Controller
{

    /**
     * Obtenir les groupes que le professeur enseigne
     */
    public function getMyGroups()
{
    $teacher = Auth::user();
    
    // Debug: Log pour vérifier l'utilisateur
    \Log::info("Prof ID: {$teacher->id} fetching groups");
    
    try {
        $groups = $teacher->teachingGroups()
                        ->withCount(['students'])
                        ->get(['id', 'name', 'niveau', 'filiere_id']);
        
        // Debug: Log les données avant envoi
        \Log::info('Groups data:', $groups->toArray());
        
        return response()->json($groups);
        
    } catch (\Exception $e) {
        \Log::error("Error fetching groups: ".$e->getMessage());
        return response()->json([], 200); // Toujours retourner un tableau même en cas d'erreur
    }
}

    /**
     * Obtenir les étudiants des groupes que le professeur enseigne
     */
    public function getMyStudents()
    {
        $teacher = Auth::user();

        $students = User::whereHas('groupes', function($query) use ($teacher) {
                $query->whereIn('groupes.id', $teacher->teachingGroups()->pluck('groupes.id'))
                      ->where('group_users.role', 'etudiant');
            })
            ->with(['groupes' => function($query) use ($teacher) {
                $query->whereIn('groupes.id', $teacher->teachingGroups()->pluck('groupes.id'))
                      ->select('groupes.id', 'name');
            }])
            ->get(['id', 'name', 'email']);

        return response()->json($students);
    }

    // Dans ProfController.php
public function getGroupStudents($groupId)
{
    $teacher = Auth::user();
    
    try {
        $group = Group::findOrFail($groupId);

        if (!$teacher->teachingGroups()->where('groupes.id', $groupId)->exists()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $students = $group->students()
                        ->select([
                            'users.id',
                            'users.name',
                            'users.email',
                            'users.cni'
                        ])
                        ->withCount(['absences as total_absences' => function($query) use ($groupId) {
                            $query->where('group_id', $groupId);
                        }])
                        ->with(['absences' => function($query) use ($groupId) {
                            $query->where('group_id', $groupId)
                                  ->orderBy('date', 'desc')
                                  ->limit(3);
                        }])
                        ->get();

        return response()->json($students);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Groupe non trouvé'], 404);
    }
} 
    public function getGroupDetails($groupId)
{
    $teacher = Auth::user();
    
    try {
        // Version avec Eloquent
        $isTeaching = $teacher->teachingGroups()
                            ->where('groupes.id', $groupId)
                            ->exists();

        if (!$isTeaching) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $group = Group::withCount(['students', 'teachers'])
                    ->findOrFail($groupId);

        return response()->json($group);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Groupe non trouvé'], 404);
    }
}
public function addAbsence(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'group_id' => 'required|exists:groupes,id',
        'date' => 'required|date',
        'justified' => 'sometimes|boolean'
    ]);

    // Vérifier que le prof enseigne ce groupe
    if (!Auth::user()->teachingGroups()->where('groupes.id', $request->group_id)->exists()) {
        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    $absence = Absence::create($validated);
    return response()->json($absence, 201);
}
public function justifyAbsences(Request $request, $userId)
{
    $validated = $request->validate([
        'group_id' => 'required|exists:groupes,id'
    ]);

    // Vérification d'accès
    if (!Auth::user()->teachingGroups()->where('groupes.id', $request->group_id)->exists()) {
        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    Absence::where('user_id', $userId)
          ->where('group_id', $request->group_id)
          ->where('justified', false)
          ->update(['justified' => true]);
          return response()->json(['message' => 'Absences justifiées']);
        }
}

