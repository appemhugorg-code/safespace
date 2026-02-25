<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailTestController extends Controller
{
    public function sendTest(Request $request)
    {
        $email = $request->input('email', auth()->user()?->email ?? 'test@example.com');

        try {
            Mail::raw('This is a test email from SafeSpace using Resend!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('SafeSpace - Test Email');
            });

            return response()->json([
                'success' => true,
                'message' => "Test email sent successfully to {$email}",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
