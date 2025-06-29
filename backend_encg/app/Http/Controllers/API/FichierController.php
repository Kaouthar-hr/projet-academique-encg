<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FichierController extends Controller
{
    // FichierController.php
public function show($folder, $filename)
{
    $path = "public/{$folder}/{$filename}";

    if (!Storage::exists($path)) {
        abort(404);
    }

    return response()->file(storage_path("app/{$path}"));
}
}
