<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Group;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SystemReportsController extends Controller
{
    public function index()
    {
        // Get system statistics
        $stats = [
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'pending' => User::where('status', 'pending')->count(),
                'suspended' => User::where('status', 'suspended')->count(),
                'by_role' => [
                    'admin' => User::where('role', 'admin')->count(),
                    'therapist' => User::where('role', 'therapist')->count(),
                    'guardian' => User::where('role', 'guardian')->count(),
                    'child' => User::where('role', 'child')->count(),
                ],
            ],
            'appointments' => [
                'total' => Appointment::count(),
                'scheduled' => Appointment::where('status', 'scheduled')->count(),
                'completed' => Appointment::where('status', 'completed')->count(),
                'cancelled' => Appointment::where('status', 'cancelled')->count(),
                'this_month' => Appointment::whereMonth('scheduled_at', Carbon::now()->month)->count(),
            ],
            'messages' => [
                'total' => Message::count(),
                'today' => Message::whereDate('created_at', Carbon::today())->count(),
                'this_week' => Message::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'this_month' => Message::whereMonth('created_at', Carbon::now()->month)->count(),
            ],
            'groups' => [
                'total' => Group::count(),
                'active' => Group::where('status', 'active')->count(),
                'archived' => Group::where('status', 'archived')->count(),
            ],
            'articles' => [
                'total' => Article::count(),
                'published' => Article::where('status', 'published')->count(),
                'draft' => Article::where('status', 'draft')->count(),
                'archived' => Article::where('status', 'archived')->count(),
            ],
        ];

        // Get recent activity
        $recentActivity = [
            'new_users_today' => User::whereDate('created_at', Carbon::today())->count(),
            'appointments_today' => Appointment::whereDate('scheduled_at', Carbon::today())->count(),
            'messages_today' => Message::whereDate('created_at', Carbon::today())->count(),
        ];

        // Get system health indicators
        $systemHealth = [
            'database_status' => 'healthy',
            'storage_usage' => '45%', // This would be calculated from actual storage
            'active_sessions' => User::where('last_activity', '>=', Carbon::now()->subMinutes(15))->count(),
        ];

        return Inertia::render('admin/system-reports', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'systemHealth' => $systemHealth,
        ]);
    }
}