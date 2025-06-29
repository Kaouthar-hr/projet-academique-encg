<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = User::where('role', 'enseignant')
                      ->select('id', 'name', 'email', 'cni', 'specialite', 'grade', 'created_at')
                      ->get();
        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'cni' => 'required|string|max:20|unique:users,cni',
            'specialite' => 'required|string|max:255',
            'grade' => 'required|string|in:Professeur,Maître de conférences,Chargé de cours,Assistant',
        ]);

        $enseignant = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'cni' => $request->cni,
            'specialite' => $request->specialite,
            'grade' => $request->grade,
            'role' => 'enseignant',
        ]);

        return response()->json($enseignant, 201);
    }

    public function update(Request $request, $id)
    {
        $enseignant = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$enseignant->id,
            'cni' => 'required|string|max:20|unique:users,cni,'.$enseignant->id,
            'specialite' => 'required|string|max:255',
            'grade' => 'required|string|in:Professeur,Maître de conférences,Chargé de cours,Assistant',
        ]);

        $enseignant->update([
            'name' => $request->name,
            'email' => $request->email,
            'cni' => $request->cni,
            'specialite' => $request->specialite,
            'grade' => $request->grade,
        ]);

        return response()->json($enseignant);
    }

    public function destroy($id)
    {
        $enseignant = User::findOrFail($id);
        $enseignant->delete();

        return response()->json(['message' => 'Teacher deleted successfully']);
    }
    
}