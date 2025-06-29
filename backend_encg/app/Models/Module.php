<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Note;
class Module extends Model
{
    use HasFactory;

    protected $fillable = ['intitule', 'coefficient', 'volume_horaire', 'semestre'];

    public function notes()
    {
        return $this->hasMany(Note::class, 'id_module');
    }
}
