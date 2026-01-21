<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Disabled until domain is set up
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable // implements MustVerifyEmail // Disabled until domain is set up
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'guardian_id',
        'terms_accepted',
        'terms_accepted_at',
        'terms_version',
        'theme_preferences',
        'country_code',
        'phone_number',
        'full_phone_number',
        'phone_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factory_recovery_codes',
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
            'terms_accepted' => 'boolean',
            'terms_accepted_at' => 'datetime',
            'theme_preferences' => 'array',
            'phone_verified_at' => 'datetime',
        ];
    }

    /**
     * Get the children for this guardian.
     */
    public function children()
    {
        return $this->hasMany(User::class, 'guardian_id');
    }

    /**
     * Get the guardian for this child.
     */
    public function guardian()
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    /**
     * Get the therapist's availability schedule.
     */
    public function availability()
    {
        return $this->hasMany(TherapistAvailability::class, 'therapist_id');
    }

    /**
     * Get the therapist's availability overrides.
     */
    public function availabilityOverrides()
    {
        return $this->hasMany(TherapistAvailabilityOverride::class, 'therapist_id');
    }

    /**
     * Get all appointments related to this user (as therapist, child, or guardian).
     */
    public function appointments()
    {
        return Appointment::where('therapist_id', $this->id)
            ->orWhere('child_id', $this->id)
            ->orWhere('guardian_id', $this->id);
    }

    /**
     * Get appointments where user is the therapist.
     */
    public function therapistAppointments()
    {
        return $this->hasMany(Appointment::class, 'therapist_id');
    }

    /**
     * Get appointments where user is the client.
     */
    public function clientAppointments()
    {
        return $this->hasMany(Appointment::class, 'child_id');
    }

    /**
     * Get appointments where user is the guardian.
     */
    public function guardianAppointments()
    {
        return $this->hasMany(Appointment::class, 'guardian_id');
    }

    /**
     * Get user's bookmarked articles.
     */
    public function bookmarks()
    {
        return $this->hasMany(UserBookmark::class);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Check if user has any of the specified roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if user is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if user is suspended.
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Check if user is disabled.
     */
    public function isDisabled(): bool
    {
        return $this->status === 'disabled';
    }

    /**
     * Check if user is deleted.
     */
    public function isDeleted(): bool
    {
        return $this->status === 'deleted';
    }

    /**
     * Get all suspension records for this user.
     */
    public function suspensions()
    {
        return $this->hasMany(UserSuspension::class);
    }

    /**
     * Get the current active suspension for this user.
     */
    public function currentSuspension()
    {
        return $this->suspensions()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('suspended_until')
                    ->orWhere('suspended_until', '>', now());
            })
            ->latest()
            ->first();
    }

    /**
     * Check if user has an active suspension.
     */
    public function hasActiveSuspension(): bool
    {
        return $this->currentSuspension() !== null;
    }

    /**
     * Get the mood logs for this user.
     */
    public function moodLogs()
    {
        return $this->hasMany(\App\Models\MoodLog::class);
    }

    /**
     * Get the articles authored by this user.
     */
    public function articles()
    {
        return $this->hasMany(\App\Models\Article::class, 'author_id');
    }

    /**
     * Get the articles read by this user.
     */
    public function articleReads()
    {
        return $this->hasMany(\App\Models\ArticleRead::class);
    }

    /**
     * Get the game progress for this user.
     */
    public function gameProgress()
    {
        return $this->hasMany(\App\Models\GameProgress::class);
    }

    /**
     * Get the achievements earned by this user.
     */
    public function achievements()
    {
        return $this->belongsToMany(\App\Models\Achievement::class, 'user_achievements')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    /**
     * Get the content engagements for this user.
     */
    public function contentEngagements()
    {
        return $this->hasMany(\App\Models\ContentEngagement::class);
    }

    /**
     * Get panic alerts triggered by this user (if child).
     */
    public function panicAlerts()
    {
        return $this->hasMany(\App\Models\PanicAlert::class, 'child_id');
    }

    /**
     * Get panic alerts resolved by this user.
     */
    public function resolvedPanicAlerts()
    {
        return $this->hasMany(\App\Models\PanicAlert::class, 'resolved_by');
    }

    /**
     * Get panic alert notifications for this user.
     */
    public function panicAlertNotifications()
    {
        return $this->hasMany(\App\Models\PanicAlertNotification::class, 'notified_user_id');
    }

    /**
     * Get unviewed panic alert notifications count.
     */
    public function getUnviewedPanicAlertsCountAttribute()
    {
        return $this->panicAlertNotifications()->unviewed()->count();
    }

    /**
     * Get assigned children for therapists.
     */
    public function getAssignedChildrenAttribute()
    {
        if (! $this->hasRole('therapist')) {
            return collect();
        }

        // For now, return all active children
        // In a real implementation, you'd have a therapist-child assignment table
        return User::role('child')->where('status', 'active')->get();
    }

    /**
     * Get groups that this user is a member of.
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get groups where this user is an admin.
     */
    public function adminGroups()
    {
        return $this->belongsToMany(Group::class, 'group_members')
            ->wherePivot('role', 'admin')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get groups created by this user.
     */
    public function createdGroups()
    {
        return $this->hasMany(Group::class, 'created_by');
    }

    /**
     * Get join requests made by this user.
     */
    public function groupJoinRequests()
    {
        return $this->hasMany(GroupJoinRequest::class);
    }

    /**
     * Get join requests reviewed by this user.
     */
    public function reviewedJoinRequests()
    {
        return $this->hasMany(GroupJoinRequest::class, 'reviewed_by');
    }

    /**
     * Get group leave logs for this user.
     */
    public function groupLeaveLogs()
    {
        return $this->hasMany(GroupLeaveLog::class);
    }

    /**
     * Check if user can create groups.
     */
    public function canCreateGroups(): bool
    {
        return $this->hasAnyRole(['admin', 'therapist']);
    }

    /**
     * Check if user can manage a specific group.
     */
    public function canManageGroup(Group $group): bool
    {
        return $this->hasRole('admin') || $group->hasAdmin($this);
    }

    /**
     * Check if user is a member of a specific group.
     */
    public function isMemberOf(Group $group): bool
    {
        return $group->hasMember($this);
    }

    /**
     * Check if user is an admin of a specific group.
     */
    public function isAdminOf(Group $group): bool
    {
        return $group->hasAdmin($this);
    }

    /**
     * Relationship to user's email preferences.
     */
    public function emailPreferences()
    {
        return $this->hasOne(UserEmailPreferences::class);
    }

    /**
     * Get user's email preferences (create if not exists).
     */
    public function getEmailPreferences(): UserEmailPreferences
    {
        return UserEmailPreferences::getForUser($this);
    }

    /**
     * Relationship to user's notification preferences.
     */
    public function notificationPreferences()
    {
        return $this->hasOne(NotificationPreference::class);
    }

    /**
     * Get user's notification preferences (create if not exists).
     */
    public function getNotificationPreferences(): NotificationPreference
    {
        return $this->notificationPreferences()->firstOrCreate(
            ['user_id' => $this->id],
            [
                'email_notifications' => true,
                'push_notifications' => true,
                'sound_enabled' => true,
                'appointment_notifications' => true,
                'message_notifications' => true,
                'panic_alert_notifications' => true,
                'content_notifications' => true,
                'system_notifications' => true,
            ]
        );
    }

    /**
     * Get user's notifications.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Check if user has accepted terms of service.
     */
    public function hasAcceptedTerms(): bool
    {
        return $this->terms_accepted && $this->terms_accepted_at !== null;
    }

    /**
     * Check if user needs to accept updated terms.
     */
    public function needsToAcceptTerms(string $currentVersion = '1.0'): bool
    {
        return !$this->hasAcceptedTerms() || $this->terms_version !== $currentVersion;
    }

    /**
     * Get the user's preferences.
     */
    public function preferences()
    {
        return $this->hasOne(UserPreference::class);
    }

    /**
     * Get user's preferences (create if not exists).
     */
    public function getPreferences(): UserPreference
    {
        return $this->preferences()->firstOrCreate(
            ['user_id' => $this->id],
            UserPreference::getDefaults()
        );
    }

    /**
     * Get therapeutic connections where this user is the therapist.
     */
    public function therapistConnections()
    {
        return $this->hasMany(TherapistClientConnection::class, 'therapist_id');
    }

    /**
     * Get therapeutic connections where this user is the client.
     */
    public function clientConnections()
    {
        return $this->hasMany(TherapistClientConnection::class, 'client_id');
    }

    /**
     * Get connection requests made by this user.
     */
    public function connectionRequests()
    {
        return $this->hasMany(ConnectionRequest::class, 'requester_id');
    }

    /**
     * Get connection requests targeting this user as therapist.
     */
    public function incomingConnectionRequests()
    {
        return $this->hasMany(ConnectionRequest::class, 'target_therapist_id');
    }

    /**
     * Get active therapeutic connections as therapist.
     */
    public function getActiveTherapistConnections()
    {
        return $this->therapistConnections()->active();
    }

    /**
     * Get active therapeutic connections as client.
     */
    public function getActiveClientConnections()
    {
        return $this->clientConnections()->active();
    }

    /**
     * Get connected therapists for this client.
     */
    public function getConnectedTherapists()
    {
        return User::whereIn('id', 
            $this->clientConnections()->active()->pluck('therapist_id')
        );
    }

    /**
     * Get connected clients for this therapist.
     */
    public function getConnectedClients(string $clientType = null)
    {
        $query = $this->therapistConnections()->active();
        
        if ($clientType) {
            $query->where('client_type', $clientType);
        }
        
        return User::whereIn('id', $query->pluck('client_id'));
    }

    /**
     * Get connected guardians for this therapist.
     */
    public function getConnectedGuardians()
    {
        return $this->getConnectedClients('guardian');
    }

    /**
     * Get connected children for this therapist.
     */
    public function getConnectedChildren()
    {
        return $this->getConnectedClients('child');
    }

    /**
     * Check if this user has an active connection with another user.
     */
    public function hasActiveConnectionWith(User $otherUser): bool
    {
        return TherapistClientConnection::where(function ($query) use ($otherUser) {
            $query->where('therapist_id', $this->id)
                  ->where('client_id', $otherUser->id);
        })->orWhere(function ($query) use ($otherUser) {
            $query->where('therapist_id', $otherUser->id)
                  ->where('client_id', $this->id);
        })->active()->exists();
    }

    /**
     * Check if this user can connect with another user.
     */
    public function canConnectWith(User $otherUser): bool
    {
        // Therapists can connect with guardians and children
        if ($this->hasRole('therapist')) {
            return $otherUser->hasAnyRole(['guardian', 'child']);
        }

        // Guardians can connect with therapists
        if ($this->hasRole('guardian')) {
            return $otherUser->hasRole('therapist');
        }

        // Children cannot initiate connections
        return false;
    }

    /**
     * Get the full formatted phone number.
     */
    public function getFormattedPhoneAttribute(): ?string
    {
        if (!$this->country_code || !$this->phone_number) {
            return null;
        }

        return $this->country_code . ' ' . $this->phone_number;
    }

    /**
     * Set the phone number and automatically format the full phone number.
     */
    public function setPhoneNumber(string $countryCode, string $phoneNumber): void
    {
        $this->country_code = $countryCode;
        $this->phone_number = $phoneNumber;
        $this->full_phone_number = $countryCode . $phoneNumber;
    }

    /**
     * Check if user has a phone number.
     */
    public function hasPhoneNumber(): bool
    {
        return !empty($this->country_code) && !empty($this->phone_number);
    }

    /**
     * Check if user's phone number is verified.
     */
    public function hasVerifiedPhoneNumber(): bool
    {
        return $this->hasPhoneNumber() && !is_null($this->phone_verified_at);
    }

    /**
     * Mark phone number as verified.
     */
    public function markPhoneAsVerified(): void
    {
        $this->phone_verified_at = now();
        $this->save();
    }

    /**
     * Check if phone number is required for this user role.
     */
    public function isPhoneNumberRequired(): bool
    {
        return $this->hasAnyRole(['therapist', 'guardian']);
    }
}
