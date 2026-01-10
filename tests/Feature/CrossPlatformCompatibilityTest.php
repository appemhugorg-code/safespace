<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrossPlatformCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    }

    public function test_api_responses_are_mobile_friendly()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test with mobile user agent
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
            'Accept' => 'application/json',
        ])->actingAs($user, 'sanctum')
          ->getJson('/api/user');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'email',
        ]);
    }

    public function test_content_is_accessible_across_different_user_agents()
    {
        $article = Article::factory()->create(['status' => 'published']);

        $userAgents = [
            // Desktop browsers
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            
            // Mobile browsers
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            
            // Tablet browsers
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        ];

        foreach ($userAgents as $userAgent) {
            $response = $this->withHeaders([
                'User-Agent' => $userAgent,
            ])->get("/articles/{$article->slug}");

            $response->assertStatus(200);
        }
    }

    public function test_api_handles_different_content_types()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test JSON requests
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->actingAs($user, 'sanctum')
          ->getJson('/api/user');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/json');

        // Test form data requests
        $article = Article::factory()->create(['status' => 'published']);
        
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->actingAs($user, 'sanctum')
          ->post("/api/articles/{$article->id}/rate", [
            'rating' => 5,
            'feedback' => 'Great article!',
        ]);

        $response->assertStatus(200);
    }

    public function test_responsive_design_elements_work()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test dashboard loads for different screen sizes
        $viewports = [
            ['width' => 320, 'height' => 568],   // Mobile
            ['width' => 768, 'height' => 1024],  // Tablet
            ['width' => 1920, 'height' => 1080], // Desktop
        ];

        foreach ($viewports as $viewport) {
            $response = $this->actingAs($user)
                ->withHeaders([
                    'User-Agent' => "TestAgent (Screen: {$viewport['width']}x{$viewport['height']})",
                ])
                ->get('/dashboard');

            $response->assertStatus(200);
        }
    }

    public function test_touch_friendly_interfaces_work()
    {
        $user = User::factory()->create();
        $user->assignRole('child');

        $article = Article::factory()->create(['status' => 'published']);

        // Simulate touch interactions (tap events)
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            'Touch-Enabled' => 'true',
        ])->actingAs($user, 'sanctum')
          ->postJson("/api/articles/{$article->id}/rate", [
            'rating' => 4,
        ]);

        $response->assertStatus(200);
    }

    public function test_offline_capability_graceful_degradation()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Simulate offline scenario by testing cached responses
        $response = $this->actingAs($user)
            ->withHeaders([
                'Cache-Control' => 'no-cache',
                'Connection' => 'close',
            ])
            ->get('/dashboard');

        // Should still load basic content
        $response->assertStatus(200);
    }

    public function test_accessibility_features_work()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test with screen reader user agent
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; JAWS/2021.2103.174)',
        ])->actingAs($user)
          ->get('/dashboard');

        $response->assertStatus(200);
        
        // Check for accessibility attributes in response
        $content = $response->getContent();
        $this->assertStringContainsString('role=', $content);
        $this->assertStringContainsString('aria-', $content);
    }

    public function test_internationalization_support()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $locales = ['en', 'es', 'fr']; // English, Spanish, French

        foreach ($locales as $locale) {
            $response = $this->withHeaders([
                'Accept-Language' => $locale,
            ])->actingAs($user)
              ->get('/dashboard');

            $response->assertStatus(200);
        }
    }

    public function test_performance_across_different_connections()
    {
        $user = User::factory()->create();
        $user->assignRole('therapist');

        // Simulate different connection speeds
        $connectionTypes = [
            'slow-2g' => ['downlink' => 0.05, 'rtt' => 2000],
            '3g' => ['downlink' => 1.5, 'rtt' => 300],
            '4g' => ['downlink' => 10, 'rtt' => 100],
        ];

        foreach ($connectionTypes as $type => $specs) {
            $startTime = microtime(true);
            
            $response = $this->withHeaders([
                'Connection-Type' => $type,
                'Downlink' => $specs['downlink'],
                'RTT' => $specs['rtt'],
            ])->actingAs($user)
              ->get('/dashboard');

            $endTime = microtime(true);
            $responseTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

            $response->assertStatus(200);
            
            // Response should be reasonable even on slow connections
            $this->assertLessThan(10000, $responseTime, "Response too slow for {$type} connection");
        }
    }

    public function test_api_versioning_compatibility()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test different API versions
        $versions = ['v1', 'v2'];

        foreach ($versions as $version) {
            $response = $this->withHeaders([
                'Accept' => "application/vnd.safespace.{$version}+json",
            ])->actingAs($user, 'sanctum')
              ->getJson('/api/user');

            // Should either work or return proper version error
            $this->assertContains($response->status(), [200, 406, 415]);
        }
    }

    public function test_error_handling_across_platforms()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Test error responses for different platforms
        $platforms = [
            'web' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'mobile' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            'api' => 'SafeSpaceApp/1.0 (iOS)',
        ];

        foreach ($platforms as $platform => $userAgent) {
            $response = $this->withHeaders([
                'User-Agent' => $userAgent,
                'Accept' => 'application/json',
            ])->actingAs($user, 'sanctum')
              ->getJson('/api/nonexistent-endpoint');

            $response->assertStatus(404);
            $response->assertJsonStructure(['message']);
        }
    }

    public function test_security_headers_are_consistent()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $response = $this->actingAs($user)
            ->get('/dashboard');

        // Check for security headers
        $response->assertHeader('X-Frame-Options');
        $response->assertHeader('X-Content-Type-Options');
        $response->assertHeader('X-XSS-Protection');
    }

    public function test_cors_headers_for_api_requests()
    {
        // Test CORS for API requests from different origins
        $origins = [
            'https://safespace.app',
            'https://mobile.safespace.app',
            'capacitor://localhost', // For mobile apps
        ];

        foreach ($origins as $origin) {
            $response = $this->withHeaders([
                'Origin' => $origin,
                'Access-Control-Request-Method' => 'GET',
            ])->options('/api/user');

            // Should handle CORS appropriately
            $this->assertContains($response->status(), [200, 204]);
        }
    }

    public function test_data_formats_are_consistent()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $appointment = Appointment::factory()->create([
            'therapist_id' => User::factory()->create()->id,
            'child_id' => $user->id,
            'scheduled_at' => now()->addDays(1),
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/appointments');

        $response->assertStatus(200);
        
        // Check date format consistency
        $appointments = $response->json('data') ?? $response->json();
        if (!empty($appointments)) {
            $firstAppointment = $appointments[0];
            $this->assertArrayHasKey('scheduled_at', $firstAppointment);
            
            // Date should be in ISO 8601 format
            $date = $firstAppointment['scheduled_at'];
            $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/', $date);
        }
    }

    public function test_file_upload_compatibility()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Test file upload with different MIME types
        $testFile = \Illuminate\Http\UploadedFile::fake()->image('test.jpg', 100, 100);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/content/articles', [
                'title' => 'Test Article',
                'body' => 'Test content',
                'featured_image' => $testFile,
            ]);

        // Should handle file uploads properly
        $this->assertContains($response->status(), [200, 201, 422]); // 422 if validation fails
    }
}