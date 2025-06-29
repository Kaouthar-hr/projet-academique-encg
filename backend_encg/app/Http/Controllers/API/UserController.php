<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
public function index(Request $request)
{
    $query = User::query();
    
    if ($request->has('role') && $request->role !== 'all') {
        $query->where('role', $request->role);
    }
    
    return response()->json($query->get());
}
}