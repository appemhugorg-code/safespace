<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\MoodLog;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Article;
use App\Models\PanicAlert;
use Carbon\Carbon;

/**
 * UAT Data Factory for generating realistic test data
 */
class UATDataFactory extends Factory
{
    /**
     * Generate realistic mood log data
     */
    public static function createMoodLogs(User $child, int $days = 30): array
    {
        $moodLogs = [];
        $moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
        
        $moodDescriptions = [
            'very_sad' => [
                'Feeling really down today',
                'Had a tough day at school',
                'Missing my friends',
                'Everything feels hard',
         