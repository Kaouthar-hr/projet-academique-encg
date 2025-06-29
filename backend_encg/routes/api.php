<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/current', [AuthController::class, 'getCurrentUser']);
});


use App\Http\Controllers\API\AdminController;
Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    Route::post('/admin/upload-admis', [AdminController::class, 'uploadAdmis']);
});

use App\Http\Controllers\API\FiliereController;
Route::middleware('auth:api')->get('/filieres', [FiliereController::class, 'index']);

use App\Http\Controllers\API\InscriptionController;

Route::middleware('auth:api')->group(function () {
    Route::get('/inscriptions', [InscriptionController::class, 'index']);
    Route::post('/inscriptions', [InscriptionController::class, 'store']);
    Route::get('/inscriptions/{id}', [InscriptionController::class, 'show']);
    Route::get('/inscriptions', [InscriptionController::class, 'mesInscriptions']);

});
//pour Admin
Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    Route::patch('/inscriptions/{id}/statut', [InscriptionController::class, 'updateStatut']);
    Route::get('/admin/inscriptions', [InscriptionController::class, 'allInscriptions']);
});

//COMPTE PROF
use App\Http\Controllers\API\TeacherController;

Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::put('/teachers/{id}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
    
});

use Illuminate\Support\Facades\Storage;

// Route pour récupérer les fichiers
Route::get('/files/{folder}/{filename}', [FileController::class, 'show'])
    ->middleware('auth:api');

    use App\Http\Controllers\API\RecuController;

    Route::get('/recu/{id}', [RecuController::class, 'generate'])->middleware('auth:api');


use App\Http\Controllers\API\ProfileController;

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

use App\Http\Controllers\API\DemandeAdministrativeController;
Route::middleware('auth:api')->group(function () {
    Route::post('/demandes', [DemandeAdministrativeController::class, 'store']);
    Route::get('/mes-demandes', [DemandeAdministrativeController::class, 'myRequests']);
    
    Route::middleware('isAdmin')->group(function () {
        Route::get('/demandes', [DemandeAdministrativeController::class, 'index']);
        Route::put('/demandes/{id}', [DemandeAdministrativeController::class, 'update']);
    });
});

// Gestion des notes
use App\Http\Controllers\API\NoteController;

Route::middleware('auth:api')->group(function () {
    
    Route::get('/mes-notes', [NoteController::class, 'mesNotes']);
    
    Route::post('/enseignant/ajouter-note', [NoteController::class, 'store']);
    Route::put('/enseignant/modifier-note/{id}', [NoteController::class, 'update']);
    Route::get('/enseignant/notes', [NoteController::class, 'notesDesEtudiants']);});

//Module:
use App\Http\Controllers\API\ModuleController;

Route::middleware(['auth:api', 'isAdmin'])->group(function () {
Route::get('/modules', [ModuleController::class, 'index']); // Afficher tous les modules
Route::post('/modules', [ModuleController::class, 'store']); // Créer un nouveau module
Route::get('/modules/{id}', [ModuleController::class, 'show']); // Afficher un module spécifique
Route::put('/modules/{id}', [ModuleController::class, 'update']); // Mettre à jour un module
Route::delete('/modules/{id}', [ModuleController::class, 'destroy']); // Supprimer un module
});

  

    

Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    Route::get('/admin/notes', [NoteController::class, 'index']); 
    Route::put('/admin/notes/{id}', [NoteController::class, 'modifier']); 
    Route::delete('/admin/notes/{id}', [NoteController::class, 'destroy']);  
});

use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\UserController;

Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    // Gestion des groupes
    Route::prefix('groups')->group(function () {
        // Créer un groupe
        Route::post('/', [GroupController::class, 'createGroup']);
        
        // Obtenir tous les groupes
        Route::get('/', [GroupController::class, 'getAllGroups']);
        
        // Gestion des membres
        Route::prefix('/{groupId}')->group(function () {
            // Ajouter un membre
            Route::post('/members', [GroupController::class, 'addMember']);
            
            // Obtenir tous les membres
            Route::get('/members', [GroupController::class, 'getMembers']);
            
            // Obtenir les étudiants
            Route::get('/students', [GroupController::class, 'getStudents']);
            
            // Obtenir les enseignants
            Route::get('/teachers', [GroupController::class, 'getTeachers']);
            
            // Retirer un membre
            Route::delete('/members', [GroupController::class, 'removeMember']);
        });
    });

    // Gestion des utilisateurs
    Route::get('/users', [UserController::class, 'index']);
});

use App\Http\Controllers\API\ProfController;
Route::prefix('prof')->middleware('auth:api')->group(function() {
    Route::get('/groups', [ProfController::class, 'getMyGroups']);
    Route::get('/students', [ProfController::class, 'getMyStudents']);
    Route::get('/groups/{group}/students', [ProfController::class, 'getGroupStudents']);
    Route::get('/groups/{group}', [ProfController::class, 'getGroupDetails']);
    Route::post('/absences', [ProfController::class, 'addAbsence']);
    Route::put('/absences/{user}/justify', [ProfController::class, 'justifyAbsences']);

});