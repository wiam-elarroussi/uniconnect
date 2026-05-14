<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'bio',
        'email',
        'password',
        'university_id',
        'role',
        'is_banned',
        'last_seen_at',
        'avatar_path',
        'karma',
        'avatar_builder',
        'campus_role',
        'requires_email_verification',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

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
            'last_seen_at' => 'datetime',
            'is_banned' => 'boolean',
            'avatar_builder' => 'array',
            'requires_email_verification' => 'boolean',
        ];
    }

    /**
     * Comptes existants (requires_email_verification = false) : accès sans lien de vérification.
     * Nouvelles inscriptions (true) : email doit être vérifié (email_verified_at).
     */
    public function hasVerifiedEmail(): bool
    {
        if (! $this->requires_email_verification) {
            return true;
        }

        return $this->email_verified_at !== null;
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_likes')->withTimestamps();
    }

    public function savedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_saves')->withTimestamps();
    }

    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')->withTimestamps();
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')->withTimestamps();
    }

    public function followedChannels()
    {
        return $this->belongsToMany(Channel::class, 'channel_follows')->withTimestamps();
    }

    public function incrementKarma(int $amount = 1): void
    {
        $this->increment('karma', $amount);
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar_path ? '/storage/'.$this->avatar_path : null;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin'], true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }
}
