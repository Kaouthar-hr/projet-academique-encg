<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeAdministrative extends Model
{
    protected $fillable = [
        'user_id', 'type', 'message', 'status', 'admin_comment', 'document_path'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
