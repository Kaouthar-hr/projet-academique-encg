<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Filiere;
use App\Models\User;


class Inscription extends Model
{
    use HasFactory;

    protected $fillable = [

       'user_id',
        'type',
        'cin',
        'cne',
        'nom_fr',
        'nom_ar',
        'prenom_fr',
        'prenom_ar',
        'lieuNaissance_fr',
        'lieuNaissance_ar',
        'dateNaissance',
        'paye_libelle',
        'nationaliter',
        'telephone',
        'situation_familiale',
        'ville_libelle_stud',
        'adresse',
        'sexe',
        'cin_mere',
        'prenom_mere',
        'nom_mere',
        'cinpere',
        'prenompere',
        'nompere',
        'adresseparent',
        'telparent',
        'professionpere',
        'professionmere',
        'bac',
        'mention_bac',
        'annee_bac',
        'lycee',
        'province_name',
        'universite',
        'annee_universitaire',
        'anneePremiereInscens',
        'lnscens',
        'niveau',
        'filiere_id',
        'photo',
        'document',
        'statut',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}

