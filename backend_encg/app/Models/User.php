<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Models\Note;
use App\Models\Group;
use App\Models\Absence;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'cni',
        'specialite',
        'grade'
    ];
    public function inscriptions()
{
    return $this->hasMany(Inscription::class, 'user_id');
}
public function notes()
{
    return $this->hasMany(Note::class, 'id_user');
}
public function groups(): BelongsToMany
{
    return $this->belongsToMany(Group::class, 'group_users', 'user_id', 'group_id')
               ->withPivot('role')
               ->withTimestamps();
}
public function teachingGroups()
{
    return $this->belongsToMany(Group::class, 'group_users', 'user_id', 'group_id')
               ->wherePivot('role', 'enseignant')
               ->withTimestamps();
}
public function studentGroups()
{
    return User::whereHas('groups', function($query) {
        $query->whereIn('groups.id', $this->teachingGroups()->pluck('groups.id'))
              ->where('group_users.role', 'etudiant');
    });
}

public function scopeStudentsOfTeacher(Builder $query, User $teacher)
{
    return $query->whereHas('groups', function($q) use ($teacher) {
        $q->whereIn('groups.id', $teacher->teachingGroups()->pluck('groups.id'))
          ->where('group_users.role', 'etudiant');
    });
}
public function absences()
{
    return $this->hasMany(Absence::class);
}





    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
