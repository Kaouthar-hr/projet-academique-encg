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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users'); 
            $table->foreignId('id_module')->constrained('modules')->onDelete('cascade'); //CASCADE
            $table->decimal('valeur', 5, 2); 
            $table->string('type'); 
            $table->date('date_evaluation'); 
            $table->boolean('valide')->default(false); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
