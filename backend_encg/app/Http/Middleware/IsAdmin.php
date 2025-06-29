<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Vérifie si l'utilisateur est authentifié
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Authentification requise'
            ], 401);
        }

        // Vérifie si l'utilisateur a le rôle admin
        // Solution 1: Si vous utilisez un champ 'role' (recommandé)
        if (Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Solution 2: Si vous utilisez un champ booléen 'is_admin'
        // if (Auth::user()->is_admin) {
        //     return $next($request);
        // }

        return response()->json([
            'message' => 'Accès refusé. Privilèges administrateur requis'
        ], 403);
    }
}