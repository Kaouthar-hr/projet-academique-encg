<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\Module;
use App\Models\User;
use Auth;

class NoteController extends Controller
{
    // الطالب يرى ملاحظاته
    public function mesNotes()
    {
        $user = Auth::user();
        $notes = Note::where('id_user', $user->id)
                     ->with('module')
                     ->get();

        return response()->json($notes);
    }

    // الأستاذ يضيف ملاحظة
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_module' => 'required|exists:modules,id',
            'valeur' => 'required|numeric|min:0|max:20',
            'type' => 'required|string',
            
            'date_evaluation' => 'required|date',
        ]);

        $note = Note::create($validated);

        return response()->json(['message' => 'Note ajoutée avec succès', 'note' => $note], 201);
    }

    // الأستاذ يعدل ملاحظة
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
            'type' => 'required|string',
            
            'date_evaluation' => 'required|date',
        ]);

        $note = Note::findOrFail($id);
        $note->update($validated);

        return response()->json(['message' => 'Note mise à jour avec succès', 'note' => $note]);
    }

    // الأستاذ يرى ملاحظات الطلبة
    public function notesDesEtudiants()
    {
        $notes = Note::with('module', 'etudiant')->get();
        return response()->json($notes);
    }

     // عرض كل النقاط
     public function index()
     {
         $notes = Note::with(['user', 'module'])->get();
         return response()->json($notes);
     }
 
     // تعديل نقطة
     public function modifier(Request $request, $id)
     {
         $note = Note::findOrFail($id);
 
         $validated = $request->validate([
             'valeur' => 'required|numeric|min:0|max:20',
             'type' => 'required|string',
             'semestre' => 'required|string',
             'date_evaluation' => 'required|date',
         ]);
 
         $note->modifier($validated);
 
         return response()->json(['message' => 'Note mise à jour avec succès', 'note' => $note]);
     }
 
     // حذف نقطة
     public function destroy($id)
     {
         $note = Note::findOrFail($id);
         $note->delete();
 
         return response()->json(['message' => 'Note supprimée avec succès']);
     }
}
