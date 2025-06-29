<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed',
        'cne' => 'required_if:role,etudiant'
    ]);

    // Si étudiant, vérifier le CNE
    if ($request->role == 'etudiant') {
        $exists = \App\Models\Admis::where('cne', $request->cne)->exists();
        if (!$exists) {
            return response()->json(['error' => 'CNE non trouvé dans la liste des admis.'], 403);
        }
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'cne' => $request->cne
    ]);

    $token = $user->createToken('authToken')->accessToken;

    return response()->json(['token' => $token, 'user' => $user]);
}
public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (auth()->attempt($credentials)) {
        $token = auth()->user()->createToken('authToken')->accessToken;
        return response()->json(['token' => $token, 'user' => auth()->user()]);
    }

    return response()->json(['error' => 'Identifiants invalides'], 401);
}
public function logout(Request $request)
{
    $request->user()->token()->revoke();
    return response()->json(['message' => 'Déconnecté avec succès']);
}
public function getCurrentUser(Request $request)
{
    $user = auth()->user();
    return response()->json([
        'name' => $user->name,
        'email' =>$user->email,
        'password'=> $user->password,
        'cne' => $user->cne, 
        
    ]);
}

}
