<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    private string $apiUrl;
    private string $username;
    private string $password;
    private string $sender;

    public function __construct()
    {
        $this->apiUrl    = config('services.tzk_sms.url');
        $this->username  = config('services.tzk_sms.username');
        $this->password  = config('services.tzk_sms.password');
        $this->sender    = config('services.tzk_sms.sender');
    }

    /**
     * Send an SMS to one or more recipients.
     *
     * @param  string|array  $recipients  Phone number(s) in local format (e.g. 0773123456)
     * @param  string        $message
     * @return bool
     */
    public function send(string|array $recipients, string $message): bool
    {
        $numbers = implode(',', (array) $recipients);

        try {
            $response = Http::post($this->apiUrl, [
                'username'  => $this->username,
                'password'  => $this->password,
                'sender'    => $this->sender,
                'message'   => $message,
                'recipient' => $numbers,
            ]);

            $body = trim($response->body());

            if (!$response->successful() || !str_starts_with($body, 'OK')) {
                Log::error('SMS send failed', ['response' => $body, 'recipients' => $numbers]);
                return false;
            }

            Log::info('SMS sent', ['response' => $body, 'recipients' => $numbers]);
            return true;
        } catch (\Throwable $e) {
            Log::error('SMS exception', ['error' => $e->getMessage(), 'recipients' => $numbers]);
            return false;
        }
    }
}
