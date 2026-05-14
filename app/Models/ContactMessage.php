<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['name', 'email', 'body', 'read_at', 'user_id', 'is_anonymous'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'is_anonymous' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
