<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    /**
     * Show the consultation creation form.
     */
    public function create()
    {
        // Get all active guardians for the therapist to schedule consultations with
        $guardians = User::role('guardian')
            ->where('status', 'active')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('therapist/consultation-create', [
            'guardians' => $guardians,
        ]);
    }
}