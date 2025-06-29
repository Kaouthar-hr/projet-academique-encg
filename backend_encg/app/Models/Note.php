<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Module;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_module',
        'valeur',
        'type',
        
        'date_evaluation'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'id_module');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
