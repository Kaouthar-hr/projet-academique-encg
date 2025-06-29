<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    protected $fillable = ['name','niveau', 'academic_year_id','filiere_id'];
    protected $table = 'groupes'; 
    
    
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_users', 'group_id', 'user_id')
                   ->withPivot('role')
                   ->withTimestamps();
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'group_users', 'group_id', 'user_id')
                   ->wherePivot('role', 'etudiant')
                   ->select('users.id', 'users.name', 'users.email', 'users.cni');
    }

public function teachers()
{
    return $this->belongsToMany(User::class, 'group_users', 'group_id', 'user_id')
               ->wherePivot('role', 'enseignant');
}
}