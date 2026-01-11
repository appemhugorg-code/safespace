<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MoodLog;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Article;
use App\Models\TherapistAvailability;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UATTestDataSeeder extends Seeder
{
    /**
     * Run the UAT test data seeder.
     */
    public function run(): void
    {
        $this->command->info('🧪 Starting UAT Test Data Seeding...');
        
        // Ensure roles exist
        $this->ensureRolesExist();
        
        // Create UAT test users with predictable credentials
        $users = $this->createUATUsers();
        
        // Generate realistic test data
        $this->createTherapistAvailability($users);
        $this->createMoodTrackingData($users);
        $this->createAppointmentData($users);
        $this->createMessageData($users);
        $this->createContentData($users);
        
        $this->command->info('✅ UAT Test Data Seeding Complete!');
        $this->displayTestCredentials();
    }

    /**
     * Ensure all required roles exist
     */
    private function ensureRolesExist(): void
    {
        $roles = ['admin', 'therapist', 'guardian', 'child'];
        
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }
        
        $this->command->info('✅ Roles verified');
    }

    /**
     * Create comprehensive UAT test users
     */
    private function createUATUsers(): array
    {
        $this->command->info('👥 Creating UAT test users...');
        
        $users = [];
        
        // Admin UAT Users
        $users['admin1'] = User::updateOrCreate(
            ['email' => 'admin-uat@safespace.com'],
            [
                'name' => 'UAT Admin User',
                'email' => 'admin-uat@safespace.com',
                'password' => Hash::make('UATAdmin2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now(),
            ]
        );
        $users['admin1']->syncRoles(['admin']);

        $users['admin2'] = User::updateOrCreate(
            ['email' => 'admin2-uat@safespace.com'],
            [
                'name' => 'UAT System Administrator',
                'email' => 'admin2-uat@safespace.com',
                'password' => Hash::make('UATAdmin2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'created_at' => now()->subDays(25),
                'updated_at' => now(),
            ]
        );
        $users['admin2']->syncRoles(['admin']);

        // Therapist UAT Users
        $users['therapist1'] = User::updateOrCreate(
            ['email' => 'therapist1-uat@safespace.com'],
            [
                'name' => 'Dr. Sarah Johnson (UAT)',
                'email' => 'therapist1-uat@safespace.com',
                'password' => Hash::make('UATTherapist2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'bio' => 'Child psychologist specializing in anxiety and mood disorders. 15+ years experience working with children and adolescents.',
                'specializations' => json_encode(['Anxiety Disorders', 'Mood Disorders', 'ADHD', 'Family Therapy']),
                'license_number' => 'PSY-UAT-001',
                'phone' => '+1-555-0101',
                'created_at' => now()->subDays(20),
                'updated_at' => now(),
            ]
        );
        $users['therapist1']->syncRoles(['therapist']);

        $users['therapist2'] = User::updateOrCreate(
            ['email' => 'therapist2-uat@safespace.com'],
            [
                'name' => 'Dr. Michael Chen (UAT)',
                'email' => 'therapist2-uat@safespace.com',
                'password' => Hash::make('UATTherapist2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'bio' => 'Licensed clinical social worker with expertise in trauma-informed care and behavioral interventions.',
                'specializations' => json_encode(['Trauma Therapy', 'Behavioral Issues', 'Social Skills', 'Group Therapy']),
                'license_number' => 'LCSW-UAT-002',
                'phone' => '+1-555-0102',
                'created_at' => now()->subDays(18),
                'updated_at' => now(),
            ]
        );
        $users['therapist2']->syncRoles(['therapist']);

        $users['therapist3'] = User::updateOrCreate(
            ['email' => 'therapist3-uat@safespace.com'],
            [
                'name' => 'Dr. Emily Rodriguez (UAT)',
                'email' => 'therapist3-uat@safespace.com',
                'password' => Hash::make('UATTherapist2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'bio' => 'Pediatric psychiatrist focusing on developmental disorders and medication management.',
                'specializations' => json_encode(['Autism Spectrum', 'ADHD', 'Medication Management', 'Developmental Delays']),
                'license_number' => 'MD-UAT-003',
                'phone' => '+1-555-0103',
                'created_at' => now()->subDays(15),
                'updated_at' => now(),
            ]
        );
        $users['therapist3']->syncRoles(['therapist']);

        // Guardian UAT Users
        $users['guardian1'] = User::updateOrCreate(
            ['email' => 'guardian1-uat@safespace.com'],
            [
                'name' => 'Jennifer Smith (UAT)',
                'email' => 'guardian1-uat@safespace.com',
                'password' => Hash::make('UATGuardian2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'phone' => '+1-555-0201',
                'address' => '123 Maple Street, Springfield, IL 62701',
                'emergency_contact_name' => 'David Smith',
                'emergency_contact_phone' => '+1-555-0202',
                'created_at' => now()->subDays(12),
                'updated_at' => now(),
            ]
        );
        $users['guardian1']->syncRoles(['guardian']);

        $users['guardian2'] = User::updateOrCreate(
            ['email' => 'guardian2-uat@safespace.com'],
            [
                'name' => 'Robert Williams (UAT)',
                'email' => 'guardian2-uat@safespace.com',
                'password' => Hash::make('UATGuardian2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'phone' => '+1-555-0203',
                'address' => '456 Oak Avenue, Springfield, IL 62702',
                'emergency_contact_name' => 'Lisa Williams',
                'emergency_contact_phone' => '+1-555-0204',
                'created_at' => now()->subDays(10),
                'updated_at' => now(),
            ]
        );
        $users['guardian2']->syncRoles(['guardian']);

        $users['guardian3'] = User::updateOrCreate(
            ['email' => 'guardian3-uat@safespace.com'],
            [
                'name' => 'Maria Garcia (UAT)',
                'email' => 'guardian3-uat@safespace.com',
                'password' => Hash::make('UATGuardian2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'phone' => '+1-555-0205',
                'address' => '789 Pine Road, Springfield, IL 62703',
                'emergency_contact_name' => 'Carlos Garcia',
                'emergency_contact_phone' => '+1-555-0206',
                'created_at' => now()->subDays(8),
                'updated_at' => now(),
            ]
        );
        $users['guardian3']->syncRoles(['guardian']);

        // Child UAT Users
        $users['child1'] = User::updateOrCreate(
            ['email' => 'child1-uat@safespace.com'],
            [
                'name' => 'Emma Smith (UAT)',
                'email' => 'child1-uat@safespace.com',
                'password' => Hash::make('UATChild2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'guardian_id' => $users['guardian1']->id,
                'date_of_birth' => Carbon::now()->subYears(10)->subMonths(3),
                'grade_level' => '5th Grade',
                'school_name' => 'Springfield Elementary School',
                'allergies' => 'None',
                'medications' => 'None',
                'created_at' => now()->subDays(12),
                'updated_at' => now(),
            ]
        );
        $users['child1']->syncRoles(['child']);

        $users['child2'] = User::updateOrCreate(
            ['email' => 'child2-uat@safespace.com'],
            [
                'name' => 'Alex Williams (UAT)',
                'email' => 'child2-uat@safespace.com',
                'password' => Hash::make('UATChild2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'guardian_id' => $users['guardian2']->id,
                'date_of_birth' => Carbon::now()->subYears(12)->subMonths(7),
                'grade_level' => '7th Grade',
                'school_name' => 'Springfield Middle School',
                'allergies' => 'Peanuts',
                'medications' => 'Albuterol inhaler as needed',
                'created_at' => now()->subDays(10),
                'updated_at' => now(),
            ]
        );
        $users['child2']->syncRoles(['child']);

        $users['child3'] = User::updateOrCreate(
            ['email' => 'child3-uat@safespace.com'],
            [
                'name' => 'Sofia Garcia (UAT)',
                'email' => 'child3-uat@safespace.com',
                'password' => Hash::make('UATChild2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'guardian_id' => $users['guardian3']->id,
                'date_of_birth' => Carbon::now()->subYears(8)->subMonths(11),
                'grade_level' => '3rd Grade',
                'school_name' => 'Springfield Elementary School',
                'allergies' => 'None',
                'medications' => 'None',
                'created_at' => now()->subDays(8),
                'updated_at' => now(),
            ]
        );
        $users['child3']->syncRoles(['child']);

        $users['child4'] = User::updateOrCreate(
            ['email' => 'child4-uat@safespace.com'],
            [
                'name' => 'Jordan Taylor (UAT)',
                'email' => 'child4-uat@safespace.com',
                'password' => Hash::make('UATChild2024!'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'guardian_id' => $users['guardian1']->id, // Second child for Guardian 1
                'date_of_birth' => Carbon::now()->subYears(14)->subMonths(2),
                'grade_level' => '9th Grade',
                'school_name' => 'Springfield High School',
                'allergies' => 'Shellfish',
                'medications' => 'Sertraline 25mg daily',
                'created_at' => now()->subDays(6),
                'updated_at' => now(),
            ]
        );
        $users['child4']->syncRoles(['child']);

        // Create therapist-client relationships
        $this->createTherapistClientRelationships($users);

        $this->command->info('✅ Created ' . count($users) . ' UAT test users');
        
        return $users;
    }

    /**
     * Create therapist-client relationships
     */
    private function createTherapistClientRelationships(array $users): void
    {
        // Assign children to therapists
        $assignments = [
            'child1' => 'therapist1', // Emma -> Dr. Johnson
            'child2' => 'therapist1', // Alex -> Dr. Johnson
            'child3' => 'therapist2', // Sofia -> Dr. Chen
            'child4' => 'therapist3', // Jordan -> Dr. Rodriguez
        ];

        foreach ($assignments as $childKey => $therapistKey) {
            if (isset($users[$childKey]) && isset($users[$therapistKey])) {
                // Update child with assigned therapist
                $users[$childKey]->update([
                    'therapist_id' => $users[$therapistKey]->id
                ]);
            }
        }

        $this->command->info('✅ Created therapist-client relationships');
    }

    /**
     * Create therapist availability schedules
     */
    private function createTherapistAvailability(array $users): void
    {
        $this->command->info('📅 Creating therapist availability schedules...');

        $therapists = ['therapist1', 'therapist2', 'therapist3'];
        
        foreach ($therapists as $therapistKey) {
            if (!isset($users[$therapistKey])) continue;
            
            $therapist = $users[$therapistKey];
            
            // Create weekly availability (Monday to Friday, 9 AM to 5 PM)
            for ($day = 1; $day <= 5; $day++) { // 1 = Monday, 5 = Friday
                TherapistAvailability::updateOrCreate(
                    [
                        'therapist_id' => $therapist->id,
                        'day_of_week' => $day,
                    ],
                    [
                        'start_time' => '09:00:00',
                        'end_time' => '17:00:00',
                        'is_available' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // Add some Saturday availability for Dr. Johnson
            if ($therapistKey === 'therapist1') {
                TherapistAvailability::updateOrCreate(
                    [
                        'therapist_id' => $therapist->id,
                        'day_of_week' => 6, // Saturday
                    ],
                    [
                        'start_time' => '10:00:00',
                        'end_time' => '14:00:00',
                        'is_available' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        $this->command->info('✅ Created therapist availability schedules');
    }

    /**
     * Create realistic mood tracking data
     */
    private function createMoodTrackingData(array $users): void
    {
        $this->command->info('😊 Creating mood tracking data...');

        $children = ['child1', 'child2', 'child3', 'child4'];
        $moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
        $moodWeights = [5, 15, 30, 35, 15]; // Weighted distribution for realistic data

        foreach ($children as $childKey) {
            if (!isset($users[$childKey])) continue;
            
            $child = $users[$childKey];
            
            // Create 30 days of mood data
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                
                // Skip some days randomly to simulate real usage
                if (rand(1, 100) <= 15) continue; // 15% chance to skip a day
                
                // Select mood based on weighted distribution
                $moodIndex = $this->weightedRandom($moodWeights);
                $mood = $moods[$moodIndex];
                
                // Add some patterns (e.g., slightly better moods on weekends)
                if ($date->isWeekend() && rand(1, 100) <= 30) {
                    $moodIndex = min($moodIndex + 1, count($moods) - 1);
                    $mood = $moods[$moodIndex];
                }
                
                MoodLog::updateOrCreate(
                    [
                        'user_id' => $child->id,
                        'logged_at' => $date->format('Y-m-d'),
                    ],
                    [
                        'mood' => $mood,
                        'notes' => $this->generateMoodNote($mood),
                        'created_at' => $date->setTime(rand(16, 20), rand(0, 59)), // Evening entries
                        'updated_at' => $date,
                    ]
                );
            }
        }

        $this->command->info('✅ Created mood tracking data for ' . count($children) . ' children');
    }

    /**
     * Generate realistic mood notes
     */
    private function generateMoodNote(string $mood): ?string
    {
        $notes = [
            'very_sad' => [
                'Had a really hard day at school',
                'Feeling overwhelmed with homework',
                'Missing my friends',
                'Worried about the test tomorrow',
            ],
            'sad' => [
                'Not feeling great today',
                'Had an argument with my friend',
                'Tired from staying up late',
                'Stressed about school project',
            ],
            'neutral' => [
                'Just an okay day',
                'Nothing special happened',
                'Feeling alright',
                null, // Sometimes no notes
            ],
            'happy' => [
                'Had a good day at school!',
                'Played with friends at recess',
                'Got a good grade on my test',
                'Enjoyed art class today',
            ],
            'very_happy' => [
                'Amazing day! Everything went great!',
                'Had so much fun at the park',
                'Got praised by my teacher',
                'Excited about the weekend plans',
            ],
        ];

        $moodNotes = $notes[$mood] ?? [null];
        return $moodNotes[array_rand($moodNotes)];
    }

    /**
     * Weighted random selection
     */
    private function weightedRandom(array $weights): int
    {
        $totalWeight = array_sum($weights);
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

    /**
     * Create appointment data
     */
    private function createAppointmentData(array $users): void
    {
        $this->command->info('📅 Creating appointment data...');

        $appointments = [
            // Past appointments
            [
                'therapist' => 'therapist1',
                'child' => 'child1',
                'date' => now()->subDays(7),
                'duration' => 60,
                'status' => 'completed',
                'notes' => 'Good session. Emma showed improvement in expressing her feelings.',
            ],
            [
                'therapist' => 'therapist1',
                'child' => 'child2',
                'date' => now()->subDays(5),
                'duration' => 60,
                'status' => 'completed',
                'notes' => 'Worked on anxiety management techniques. Alex is making progress.',
            ],
            [
                'therapist' => 'therapist2',
                'child' => 'child3',
                'date' => now()->subDays(3),
                'duration' => 45,
                'status' => 'completed',
                'notes' => 'Sofia engaged well in play therapy activities.',
            ],
            
            // Upcoming appointments
            [
                'therapist' => 'therapist1',
                'child' => 'child1',
                'date' => now()->addDays(2)->setTime(14, 0),
                'duration' => 60,
                'status' => 'scheduled',
                'notes' => null,
            ],
            [
                'therapist' => 'therapist3',
                'child' => 'child4',
                'date' => now()->addDays(3)->setTime(15, 30),
                'duration' => 60,
                'status' => 'scheduled',
                'notes' => null,
            ],
            [
                'therapist' => 'therapist2',
                'child' => 'child3',
                'date' => now()->addDays(5)->setTime(10, 0),
                'duration' => 45,
                'status' => 'scheduled',
                'notes' => null,
            ],
        ];

        foreach ($appointments as $appointmentData) {
            if (!isset($users[$appointmentData['therapist']]) || !isset($users[$appointmentData['child']])) {
                continue;
            }

            Appointment::updateOrCreate(
                [
                    'therapist_id' => $users[$appointmentData['therapist']]->id,
                    'child_id' => $users[$appointmentData['child']]->id,
                    'scheduled_at' => $appointmentData['date'],
                ],
                [
                    'duration_minutes' => $appointmentData['duration'],
                    'status' => $appointmentData['status'],
                    'notes' => $appointmentData['notes'],
                    'google_meet_link' => $appointmentData['status'] === 'scheduled' 
                        ? 'https://meet.google.com/uat-' . strtolower(str_replace(' ', '-', $users[$appointmentData['child']]->name))
                        : null,
                    'created_at' => now()->subDays(rand(1, 10)),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('✅ Created ' . count($appointments) . ' appointments');
    }

    /**
     * Create message data
     */
    private function createMessageData(array $users): void
    {
        $this->command->info('💬 Creating message data...');

        $conversations = [
            // Guardian 1 <-> Therapist 1 about Child 1
            [
                'participants' => ['guardian1', 'therapist1'],
                'messages' => [
                    ['sender' => 'guardian1', 'content' => 'Hi Dr. Johnson, I wanted to check in about Emma\'s progress. She seems to be doing better at home.', 'days_ago' => 3],
                    ['sender' => 'therapist1', 'content' => 'Hello Jennifer! That\'s wonderful to hear. Emma has been very engaged in our sessions and is showing great improvement in expressing her emotions.', 'days_ago' => 3],
                    ['sender' => 'guardian1', 'content' => 'That\'s great news! Should we continue with the current approach?', 'days_ago' => 2],
                    ['sender' => 'therapist1', 'content' => 'Yes, I think we\'re on the right track. Let\'s discuss this more in our next session.', 'days_ago' => 2],
                ],
            ],
            
            // Guardian 2 <-> Therapist 1 about Child 2
            [
                'participants' => ['guardian2', 'therapist1'],
                'messages' => [
                    ['sender' => 'guardian2', 'content' => 'Dr. Johnson, Alex had a difficult day at school yesterday. The teacher mentioned some anxiety during the math test.', 'days_ago' => 1],
                    ['sender' => 'therapist1', 'content' => 'Thank you for letting me know, Robert. Test anxiety is something we\'ve been working on. I\'ll focus on this in our next session.', 'days_ago' => 1],
                ],
            ],
            
            // Child 1 <-> Therapist 1
            [
                'participants' => ['child1', 'therapist1'],
                'messages' => [
                    ['sender' => 'child1', 'content' => 'Hi Dr. Johnson! I used the breathing technique you taught me when I felt worried today and it helped!', 'days_ago' => 1],
                    ['sender' => 'therapist1', 'content' => 'That\'s fantastic, Emma! I\'m so proud of you for remembering to use it. How did it make you feel?', 'days_ago' => 1],
                    ['sender' => 'child1', 'content' => 'It made me feel calmer and I could focus better on my homework.', 'days_ago' => 1],
                ],
            ],
        ];

        foreach ($conversations as $conversation) {
            foreach ($conversation['messages'] as $messageData) {
                if (!isset($users[$messageData['sender']])) continue;
                
                $recipients = array_filter($conversation['participants'], function($p) use ($messageData) {
                    return $p !== $messageData['sender'];
                });
                
                foreach ($recipients as $recipientKey) {
                    if (!isset($users[$recipientKey])) continue;
                    
                    Message::create([
                        'sender_id' => $users[$messageData['sender']]->id,
                        'recipient_id' => $users[$recipientKey]->id,
                        'content' => $messageData['content'],
                        'is_read' => rand(0, 1) === 1,
                        'created_at' => now()->subDays($messageData['days_ago'])->setTime(rand(9, 17), rand(0, 59)),
                        'updated_at' => now()->subDays($messageData['days_ago']),
                    ]);
                }
            }
        }

        $this->command->info('✅ Created message conversations');
    }

    /**
     * Create content data
     */
    private function createContentData(array $users): void
    {
        $this->command->info('📚 Creating content data...');

        $articles = [
            [
                'title' => 'Understanding Childhood Anxiety: A Parent\'s Guide',
                'content' => 'Anxiety is a normal part of childhood development, but when it becomes overwhelming, it can interfere with daily activities...',
                'author' => 'therapist1',
                'category' => 'anxiety',
                'audience' => 'guardian',
                'status' => 'published',
            ],
            [
                'title' => 'Breathing Exercises for Kids',
                'content' => 'Teaching children simple breathing techniques can help them manage stress and anxiety in healthy ways...',
                'author' => 'therapist1',
                'audience' => 'child',
                'category' => 'coping-skills',
                'status' => 'published',
            ],
            [
                'title' => 'Building Emotional Intelligence in Children',
                'content' => 'Emotional intelligence is a crucial skill that helps children understand and manage their emotions...',
                'author' => 'therapist2',
                'audience' => 'guardian',
                'category' => 'emotional-development',
                'status' => 'published',
            ],
            [
                'title' => 'Creating a Safe Space at Home',
                'content' => 'Every child needs a safe space where they can express their feelings without judgment...',
                'author' => 'therapist3',
                'audience' => 'guardian',
                'category' => 'family-support',
                'status' => 'published',
            ],
        ];

        foreach ($articles as $articleData) {
            if (!isset($users[$articleData['author']])) continue;
            
            Article::updateOrCreate(
                ['title' => $articleData['title']],
                [
                    'content' => $articleData['content'],
                    'author_id' => $users[$articleData['author']]->id,
                    'category' => $articleData['category'],
                    'target_audience' => $articleData['audience'],
                    'status' => $articleData['status'],
                    'published_at' => now()->subDays(rand(1, 30)),
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('✅ Created ' . count($articles) . ' articles');
    }

    /**
     * Display test credentials for easy reference
     */
    private function displayTestCredentials(): void
    {
        $this->command->info('');
        $this->command->info('🔑 UAT Test Credentials:');
        $this->command->info('========================');
        $this->command->info('');
        
        $credentials = [
            'Admin Users' => [
                'admin-uat@safespace.com' => 'UATAdmin2024!',
                'admin2-uat@safespace.com' => 'UATAdmin2024!',
            ],
            'Therapist Users' => [
                'therapist1-uat@safespace.com' => 'UATTherapist2024!',
                'therapist2-uat@safespace.com' => 'UATTherapist2024!',
                'therapist3-uat@safespace.com' => 'UATTherapist2024!',
            ],
            'Guardian Users' => [
                'guardian1-uat@safespace.com' => 'UATGuardian2024!',
                'guardian2-uat@safespace.com' => 'UATGuardian2024!',
                'guardian3-uat@safespace.com' => 'UATGuardian2024!',
            ],
            'Child Users' => [
                'child1-uat@safespace.com' => 'UATChild2024!',
                'child2-uat@safespace.com' => 'UATChild2024!',
                'child3-uat@safespace.com' => 'UATChild2024!',
                'child4-uat@safespace.com' => 'UATChild2024!',
            ],
        ];

        foreach ($credentials as $category => $users) {
            $this->command->info("📋 {$category}:");
            foreach ($users as $email => $password) {
                $this->command->info("   {$email} / {$password}");
            }
            $this->command->info('');
        }
        
        $this->command->info('🏥 Health Check: http://localhost:8080/health');
        $this->command->info('ℹ️  Environment Info: http://localhost:8080/uat/info');
        $this->command->info('');
    }
}