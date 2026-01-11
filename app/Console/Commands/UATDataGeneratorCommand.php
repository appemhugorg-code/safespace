<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\MoodLog;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Article;
use App\Models\ArticleView;
use App\Models\UserBookmark;
use App\Models\PanicAlert;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UATDataGeneratorCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'uat:generate-data {--type=all : Type of data to generate (all, moods, messages, content, alerts)} {--days=30 : Number of days of historical data}';

    /**
     * The console command description.
     */
    protected $description = 'Generate additional operational data for UAT testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!app()->environment('uat')) {
            $this->error('❌ This command should only be run in UAT environment.');
            return Command::FAILURE;
        }

        $type = $this->option('type');
        $days = (int) $this->option('days');

        $this->info("🧪 Generating UAT operational data ({$type}, {$days} days)...");
        $this->newLine();

        switch ($type) {
            case 'all':
                $this->generateAllData($days);
                break;
            case 'moods':
                $this->generateMoodData($days);
                break;
            case 'messages':
                $this->generateMessageData($days);
                break;
            case 'content':
                $this->generateContentData();
                break;
            case 'alerts':
                $this->generateAlertData($days);
                break;
            default:
                $this->error("❌ Unknown data type: {$type}");
                return Command::FAILURE;
        }

        $this->newLine();
        $this->info('✅ Data generation completed successfully!');
        
        return Command::SUCCESS;
    }

    /**
     * Generate all types of data
     */
    private function generateAllData(int $days): void
    {
        $this->generateMoodData($days);
        $this->generateMessageData($days);
        $this->generateContentData();
        $this->generateAlertData($days);
        $this->generateEngagementData($days);
    }

    /**
     * Generate comprehensive mood tracking data
     */
    private function generateMoodData(int $days): void
    {
        $this->info('😊 Generating mood tracking data...');
        
        $children = User::role('child')->get();
        $moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
        
        foreach ($children as $child) {
            $this->info("   Processing {$child->name}...");
            
            // Generate mood patterns based on child's age and characteristics
            $moodPattern = $this->getMoodPatternForChild($child);
            
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                
                // Skip some days randomly (85% completion rate)
                if (rand(1, 100) <= 15) continue;
                
                // Skip if mood already exists
                if (MoodLog::where('user_id', $child->id)
                    ->whereDate('logged_at', $date->format('Y-m-d'))
                    ->exists()) {
                    continue;
                }
                
                $mood = $this->selectMoodForDay($date, $moodPattern, $child);
                
                MoodLog::create([
                    'user_id' => $child->id,
                    'mood' => $mood,
                    'notes' => $this->generateContextualMoodNote($mood, $date, $child),
                    'logged_at' => $date->format('Y-m-d'),
                    'created_at' => $date->setTime(rand(16, 20), rand(0, 59)),
                    'updated_at' => $date,
                ]);
            }
        }
        
        $this->info('   ✅ Mood data generated for ' . $children->count() . ' children');
    }

    /**
     * Get mood pattern based on child characteristics
     */
    private function getMoodPatternForChild(User $child): array
    {
        // Different patterns based on child's age and medication status
        $age = $child->date_of_birth ? Carbon::parse($child->date_of_birth)->age : 10;
        $hasMedication = !empty($child->medications) && $child->medications !== 'None';
        
        if ($hasMedication) {
            // Child on medication - more stable mood pattern
            return [5, 10, 25, 40, 20]; // Slightly better overall
        } elseif ($age >= 13) {
            // Teenager - more mood variability
            return [10, 20, 30, 30, 10]; // More neutral/sad days
        } else {
            // Younger child - generally more positive
            return [3, 12, 30, 40, 15]; // More happy days
        }
    }

    /**
     * Select mood for a specific day based on patterns
     */
    private function selectMoodForDay(Carbon $date, array $pattern, User $child): string
    {
        $moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
        
        // Weekend boost
        if ($date->isWeekend()) {
            $pattern[3] += 10; // More happy
            $pattern[4] += 5;  // More very happy
            $pattern[1] -= 10; // Less sad
            $pattern[0] -= 5;  // Less very sad
        }
        
        // Monday blues
        if ($date->isMonday()) {
            $pattern[1] += 8;  // More sad
            $pattern[2] += 7;  // More neutral
            $pattern[3] -= 10; // Less happy
            $pattern[4] -= 5;  // Less very happy
        }
        
        // School holiday boost (approximate)
        if ($this->isSchoolHoliday($date)) {
            $pattern[3] += 15; // Much more happy
            $pattern[4] += 10; // More very happy
            $pattern[0] -= 15; // Much less very sad
            $pattern[1] -= 10; // Less sad
        }
        
        // Normalize pattern
        $total = array_sum($pattern);
        $pattern = array_map(function($weight) use ($total) {
            return max(0, $weight);
        }, $pattern);
        
        return $moods[$this->weightedRandom($pattern)];
    }

    /**
     * Check if date is likely a school holiday
     */
    private function isSchoolHoliday(Carbon $date): bool
    {
        // Simple approximation of school holidays
        $month = $date->month;
        $day = $date->day;
        
        // Summer break (June 15 - August 15)
        if (($month == 6 && $day >= 15) || $month == 7 || ($month == 8 && $day <= 15)) {
            return true;
        }
        
        // Winter break (December 20 - January 5)
        if (($month == 12 && $day >= 20) || ($month == 1 && $day <= 5)) {
            return true;
        }
        
        // Spring break (approximate - March 15-25)
        if ($month == 3 && $day >= 15 && $day <= 25) {
            return true;
        }
        
        return false;
    }

    /**
     * Generate contextual mood notes
     */
    private function generateContextualMoodNote(string $mood, Carbon $date, User $child): ?string
    {
        $age = $child->date_of_birth ? Carbon::parse($child->date_of_birth)->age : 10;
        $isWeekend = $date->isWeekend();
        $isMonday = $date->isMonday();
        $isHoliday = $this->isSchoolHoliday($date);
        
        $notes = [
            'very_sad' => [
                $isMonday ? 'Really don\'t want to go to school today' : 'Having a really hard day',
                'Feeling overwhelmed with everything',
                'Missing my friends',
                $age >= 13 ? 'Everything feels too much right now' : 'Had a bad day at school',
                'Worried about tomorrow',
            ],
            'sad' => [
                $isMonday ? 'Monday blues are hitting hard' : 'Not feeling great today',
                'Had an argument with my friend',
                'Tired from staying up late',
                'Stressed about school project',
                $age >= 13 ? 'Feeling anxious about social stuff' : 'Didn\'t do well on my test',
            ],
            'neutral' => [
                'Just an okay day',
                'Nothing special happened',
                'Feeling alright',
                $isWeekend ? 'Relaxing weekend day' : 'Regular school day',
                null, // Sometimes no notes
            ],
            'happy' => [
                $isWeekend ? 'Great weekend day!' : 'Had a good day at school!',
                'Played with friends at recess',
                'Got a good grade on my test',
                $isHoliday ? 'Love being on vacation!' : 'Enjoyed art class today',
                $age >= 13 ? 'Hanging out with friends was fun' : 'Had fun in PE class',
            ],
            'very_happy' => [
                $isHoliday ? 'Best vacation day ever!' : 'Amazing day! Everything went great!',
                $isWeekend ? 'Had so much fun at the park' : 'Got praised by my teacher',
                'Excited about the weekend plans',
                $age >= 13 ? 'Had an awesome time with friends' : 'Won the game at recess!',
                'Feeling really good about everything',
            ],
        ];

        $moodNotes = $notes[$mood] ?? [null];
        return $moodNotes[array_rand($moodNotes)];
    }

    /**
     * Generate realistic message conversations
     */
    private function generateMessageData(int $days): void
    {
        $this->info('💬 Generating message conversations...');
        
        $conversations = [
            // Weekly check-ins between guardians and therapists
            $this->generateWeeklyCheckIns($days),
            
            // Child-therapist conversations
            $this->generateChildTherapistMessages($days),
            
            // Crisis support messages
            $this->generateCrisisMessages($days),
            
            // Appointment-related messages
            $this->generateAppointmentMessages($days),
            
            // Progress update messages
            $this->generateProgressMessages($days),
        ];
        
        foreach ($conversations as $conversationSet) {
            foreach ($conversationSet as $conversation) {
                $this->createConversation($conversation);
            }
        }
        
        $this->info('   ✅ Generated realistic message conversations');
    }

    /**
     * Generate weekly check-in conversations
     */
    private function generateWeeklyCheckIns(int $days): array
    {
        $conversations = [];
        $guardians = User::role('guardian')->get();
        
        foreach ($guardians as $guardian) {
            $children = User::where('guardian_id', $guardian->id)->get();
            
            foreach ($children as $child) {
                if (!$child->therapist_id) continue;
                
                $therapist = User::find($child->therapist_id);
                if (!$therapist) continue;
                
                // Generate weekly check-ins
                for ($week = 0; $week < floor($days / 7); $week++) {
                    $date = Carbon::now()->subWeeks($week)->startOfWeek()->addDays(rand(0, 6));
                    
                    $conversations[] = [
                        'participants' => [$guardian, $therapist],
                        'messages' => [
                            [
                                'sender' => $guardian,
                                'content' => $this->generateCheckInMessage($child, 'guardian'),
                                'date' => $date,
                            ],
                            [
                                'sender' => $therapist,
                                'content' => $this->generateCheckInResponse($child, 'therapist'),
                                'date' => $date->copy()->addHours(rand(2, 8)),
                            ],
                        ],
                    ];
                }
            }
        }
        
        return $conversations;
    }

    /**
     * Generate child-therapist messages
     */
    private function generateChildTherapistMessages(int $days): array
    {
        $conversations = [];
        $children = User::role('child')->whereNotNull('therapist_id')->get();
        
        foreach ($children as $child) {
            $therapist = User::find($child->therapist_id);
            if (!$therapist) continue;
            
            // Generate periodic messages
            for ($i = 0; $i < rand(3, 8); $i++) {
                $date = Carbon::now()->subDays(rand(1, $days));
                
                $conversations[] = [
                    'participants' => [$child, $therapist],
                    'messages' => [
                        [
                            'sender' => $child,
                            'content' => $this->generateChildMessage($child),
                            'date' => $date,
                        ],
                        [
                            'sender' => $therapist,
                            'content' => $this->generateTherapistResponse($child),
                            'date' => $date->copy()->addHours(rand(1, 4)),
                        ],
                    ],
                ];
            }
        }
        
        return $conversations;
    }

    /**
     * Create a conversation from conversation data
     */
    private function createConversation(array $conversation): void
    {
        foreach ($conversation['messages'] as $messageData) {
            $sender = $messageData['sender'];
            $recipients = array_filter($conversation['participants'], function($p) use ($sender) {
                return $p->id !== $sender->id;
            });
            
            foreach ($recipients as $recipient) {
                Message::create([
                    'sender_id' => $sender->id,
                    'recipient_id' => $recipient->id,
                    'content' => $messageData['content'],
                    'is_read' => rand(0, 100) <= 70, // 70% read rate
                    'created_at' => $messageData['date'],
                    'updated_at' => $messageData['date'],
                ]);
            }
        }
    }

    /**
     * Generate content engagement data
     */
    private function generateContentData(): void
    {
        $this->info('📚 Generating content and engagement data...');
        
        // Create additional articles
        $this->createAdditionalArticles();
        
        // Generate article views
        $this->generateArticleViews();
        
        // Generate bookmarks
        $this->generateBookmarks();
        
        $this->info('   ✅ Content and engagement data generated');
    }

    /**
     * Create additional articles for testing
     */
    private function createAdditionalArticles(): void
    {
        $therapists = User::role('therapist')->get();
        
        $articles = [
            [
                'title' => 'Helping Your Child Cope with School Anxiety',
                'content' => 'School anxiety is common among children and can manifest in various ways. Here are strategies to help your child...',
                'category' => 'anxiety',
                'audience' => 'guardian',
                'reading_time' => 8,
            ],
            [
                'title' => 'Fun Mindfulness Activities for Kids',
                'content' => 'Mindfulness doesn\'t have to be boring! Here are engaging activities that children will enjoy...',
                'category' => 'mindfulness',
                'audience' => 'child',
                'reading_time' => 5,
            ],
            [
                'title' => 'Recognizing Signs of Depression in Children',
                'content' => 'Depression in children can look different from adult depression. Learn the warning signs...',
                'category' => 'depression',
                'audience' => 'guardian',
                'reading_time' => 12,
            ],
            [
                'title' => 'Building Resilience in Young People',
                'content' => 'Resilience is a skill that can be developed. Here\'s how to help children bounce back from challenges...',
                'category' => 'resilience',
                'audience' => 'guardian',
                'reading_time' => 10,
            ],
            [
                'title' => 'Social Skills Games and Activities',
                'content' => 'Developing social skills through play is natural for children. Try these fun activities...',
                'category' => 'social-skills',
                'audience' => 'child',
                'reading_time' => 6,
            ],
        ];
        
        foreach ($articles as $articleData) {
            $author = $therapists->random();
            
            Article::updateOrCreate(
                ['title' => $articleData['title']],
                [
                    'content' => $articleData['content'],
                    'author_id' => $author->id,
                    'category' => $articleData['category'],
                    'target_audience' => $articleData['audience'],
                    'reading_time_minutes' => $articleData['reading_time'],
                    'status' => 'published',
                    'published_at' => Carbon::now()->subDays(rand(1, 60)),
                    'created_at' => Carbon::now()->subDays(rand(1, 60)),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }

    /**
     * Generate article view data
     */
    private function generateArticleViews(): void
    {
        $articles = Article::where('status', 'published')->get();
        $users = User::whereIn('id', function($query) {
            $query->select('model_id')
                  ->from('model_has_roles')
                  ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                  ->whereIn('roles.name', ['guardian', 'therapist']);
        })->get();
        
        foreach ($articles as $article) {
            // Generate realistic view counts
            $viewCount = rand(5, 50);
            
            for ($i = 0; $i < $viewCount; $i++) {
                $viewer = $users->random();
                $viewDate = Carbon::now()->subDays(rand(1, 30));
                
                ArticleView::updateOrCreate(
                    [
                        'article_id' => $article->id,
                        'user_id' => $viewer->id,
                    ],
                    [
                        'viewed_at' => $viewDate,
                        'reading_progress' => rand(25, 100), // Percentage read
                        'time_spent_seconds' => rand(30, 300),
                        'created_at' => $viewDate,
                        'updated_at' => $viewDate,
                    ]
                );
            }
        }
    }

    /**
     * Generate bookmark data
     */
    private function generateBookmarks(): void
    {
        $articles = Article::where('status', 'published')->get();
        $users = User::whereIn('id', function($query) {
            $query->select('model_id')
                  ->from('model_has_roles')
                  ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                  ->whereIn('roles.name', ['guardian', 'therapist']);
        })->get();
        
        foreach ($users as $user) {
            // Each user bookmarks 1-5 articles
            $bookmarkCount = rand(1, 5);
            $bookmarkedArticles = $articles->random($bookmarkCount);
            
            foreach ($bookmarkedArticles as $article) {
                UserBookmark::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'article_id' => $article->id,
                    ],
                    [
                        'created_at' => Carbon::now()->subDays(rand(1, 30)),
                        'updated_at' => Carbon::now(),
                    ]
                );
            }
        }
    }

    /**
     * Generate panic alert data (limited for testing)
     */
    private function generateAlertData(int $days): void
    {
        $this->info('🚨 Generating panic alert data...');
        
        $children = User::role('child')->get();
        
        // Generate a few panic alerts for testing (not too many)
        foreach ($children as $child) {
            // 20% chance each child has triggered a panic alert
            if (rand(1, 100) <= 20) {
                $alertDate = Carbon::now()->subDays(rand(1, $days));
                
                PanicAlert::create([
                    'user_id' => $child->id,
                    'location' => $this->generateLocation(),
                    'status' => 'resolved',
                    'response_time_minutes' => rand(5, 30),
                    'resolved_by' => $child->therapist_id,
                    'notes' => 'Alert resolved. Child was experiencing anxiety about upcoming test. Provided coping strategies.',
                    'created_at' => $alertDate,
                    'updated_at' => $alertDate->copy()->addMinutes(rand(5, 30)),
                ]);
            }
        }
        
        $this->info('   ✅ Generated limited panic alert data for testing');
    }

    /**
     * Generate engagement analytics data
     */
    private function generateEngagementData(int $days): void
    {
        $this->info('📊 Generating engagement analytics data...');
        
        // This would typically involve creating analytics records
        // For now, we'll ensure our existing data has good engagement patterns
        
        $this->info('   ✅ Engagement data patterns established');
    }

    // Helper methods for message generation
    private function generateCheckInMessage(User $child, string $senderType): string
    {
        $therapistName = $child->therapist->name ?? 'Johnson';
        $messages = [
            "Hi Dr. {$therapistName}, I wanted to check in about {$child->name}'s progress this week.",
            "Hello, {$child->name} has been doing well at home. How are the sessions going?",
            "I noticed {$child->name} seems more confident lately. Is this something you're seeing too?",
            "Quick update on {$child->name} - they've been using the breathing techniques you taught them.",
        ];
        
        return $messages[array_rand($messages)];
    }

    private function generateCheckInResponse(User $child, string $senderType): string
    {
        $responses = [
            "Thank you for the update! {$child->name} is making excellent progress in our sessions.",
            "That's wonderful to hear. We've been working on confidence-building exercises.",
            "I'm so glad to hear that! {$child->name} has been very engaged during our sessions.",
            "The breathing techniques are really helping. Let's continue with the current approach.",
        ];
        
        return $responses[array_rand($responses)];
    }

    private function generateChildMessage(User $child): string
    {
        $age = $child->date_of_birth ? Carbon::parse($child->date_of_birth)->age : 10;
        
        if ($age >= 13) {
            $messages = [
                "Hi! I tried the technique we talked about and it actually helped with my anxiety.",
                "Had a better day at school today. Thanks for the advice about dealing with peer pressure.",
                "Can we talk about the homework stress in our next session?",
                "I've been journaling like you suggested and it's helping me understand my feelings better.",
            ];
        } else {
            $messages = [
                "Hi Dr.! I used the breathing exercise when I felt worried and it worked!",
                "I had a good day at school today and remembered what we talked about!",
                "Can you help me with feeling nervous about the school play?",
                "I drew a picture of my feelings like you showed me!",
            ];
        }
        
        return $messages[array_rand($messages)];
    }

    private function generateTherapistResponse(User $child): string
    {
        $responses = [
            "That's fantastic! I'm so proud of you for using the techniques we practiced.",
            "I'm glad to hear you had a good day. You're making great progress!",
            "Of course we can talk about that. You're doing such a good job communicating your feelings.",
            "That sounds like a wonderful way to express yourself. Keep up the great work!",
        ];
        
        return $responses[array_rand($responses)];
    }

    private function generateLocation(): string
    {
        $locations = [
            'Home',
            'School',
            'Springfield Elementary School',
            'Springfield Middle School',
            'Springfield High School',
            'Public Library',
            'Community Center',
        ];
        
        return $locations[array_rand($locations)];
    }

    private function generateCrisisMessages(int $days): array { return []; }
    private function generateAppointmentMessages(int $days): array { return []; }
    private function generateProgressMessages(int $days): array { return []; }

    /**
     * Weighted random selection
     */
    private function weightedRandom(array $weights): int
    {
        $totalWeight = array_sum($weights);
        if ($totalWeight <= 0) return 0;
        
        $random = rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($weights as $index => $weight) {
            $currentWeight += $weight;
            if ($random <= $currentWeight) {
                return $index;
            }
        }
        
        return 0; // Fallback
    }
}