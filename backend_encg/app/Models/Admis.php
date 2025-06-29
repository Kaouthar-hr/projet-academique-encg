<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admis extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'cne',
    ];

    /**
     * The primary key for the model.
     * (Only if your primary key is not 'id')
     *
     * @var string
     */
    protected $primaryKey = 'cne'; // Only if cne is your primary key

    /**
     * Indicates if the IDs are auto-incrementing.
     * (Only if your primary key is not auto-incrementing)
     *
     * @var bool
     */
    public $incrementing = false; // Only if cne is non-integer primary key

    /**
     * The "type" of the primary key ID.
     * (Only if your primary key is not integer)
     *
     * @var string
     */
    protected $keyType = 'string'; // Only if cne is string primary key
}
