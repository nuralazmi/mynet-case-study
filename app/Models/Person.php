<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class Person extends Model
{
    use HasFactory;
    use Notifiable;

    public function address(): HasOne
    {
        return $this->hasOne(Address::class);
    }

}
