<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Filiere;


class FiliereController extends Controller
{
    public function index()
{
    return Filiere::all();
}

}
