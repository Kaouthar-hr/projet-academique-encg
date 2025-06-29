<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['inscription', 'réinscription']);
            $table->string('cin');
            $table->string('cne');
            $table->string('nom_fr');
            $table->string('nom_ar');
            $table->string('prenom_fr');
            $table->string('prenom_ar');
            $table->string('lieuNaissance_fr');
            $table->string('lieuNaissance_ar');
            $table->date('dateNaissance');
            $table->string('paye_libelle');
            $table->string('nationaliter');
            $table->string('telephone');
            $table->string('situation_familiale');
            $table->string('ville_libelle_stud');
            $table->string('adresse');
            $table->string('sexe');
            $table->string('cin_mere');
            $table->string('prenom_mere');
            $table->string('nom_mere');
            $table->string('cinpere');
            $table->string('prenompere');
            $table->string('nompere');
            $table->string('adresseparent');
            $table->string('telparent');
            $table->string('professionpere');
            $table->string('professionmere');
            $table->string('bac')->nullable();
            $table->string('mention_bac');
            $table->string('annee_bac');
            $table->string('lycee');
            $table->string('province_name');
            $table->string('universite');
            $table->string('annee_universitaire');
            $table->string('anneePremiereInscens');
            $table->string('lnscens');
            $table->enum('niveau', ['1A', '2A', '3A', '4A','5A','LP FINANCE, BANQUE & ASSURANCE','LP MANAGEMENT FINANCIER & COMTABLE']);
            $table->enum('semestre', ['semestre 2', 'semestre 4', 'semestre 6', 'semestre 8' , 'semestre 10']);
            $table->foreignId('filiere_id')->nullable()->constrained()->onDelete('set null');
           // Fichiers
            $table->string('photo')->nullable();

            $table->enum('statut', ['en attente', 'validée', 'refusée'])->default('en attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
