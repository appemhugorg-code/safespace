<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use App\Services\ContentAnalyticsService;
use App\Services\ContentModerationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentManagementSystemTest extends TestCase
{
    use RefreshDatabase;

    protected ContentModerationService $moderationService;
    protected ContentAnalyticsService $analyticsService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        
        $this->moderationService = app(ContentModerationService::class);
        $this->analyticsService = app(ContentAnalyticsService::class);
    }

    public function test_article_creation_workflow()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        // Create article
        $article = Article::factory()->create([
            'author_id' => $author->id,
            'title' => 'Test Article',
            'body' => 'This is a test article content.',
            'status' => 'draft',
        ]);

        $this->assertEquals('draft', $article->status);
        $this->assertTrue($article->isDraft());
        $this->assertFalse($article->isPublished());
    }

    public function test_article_submission_for_review()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'draft',
        ]);

        // Submit for review
        $this->moderationService->submitForReview($article);

        $article->refresh();
        $this->assertEquals('pending', $article->status);
        $this->assertTrue($article->isPending());
    }

    public function test_article_approval_workflow()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'pending',
        ]);

        // Approve article
        $this->moderationService->approveContent($article, $admin);

        $article->refresh();
        $this->assertEquals('published', $article->status);
        $this->assertTrue($article->isPublished());
        $this->assertEquals($admin->id, $article->reviewed_by);
        $this->assertNotNull($article->published_at);
    }

    public function test_article_rejection_workflow()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'pending',
        ]);

        $reason = 'Content needs improvement';

        // Reject article
        $this->moderationService->rejectContent($article, $admin, $reason);

        $article->refresh();
        $this->assertEquals('draft', $article->status);
        $this->assertEquals($reason, $article->rejection_reason);
        $this->assertEquals($admin->id, $article->reviewed_by);
    }

    public function test_article_search_functionality()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        // Create articles with different content
        Article::factory()->create([
            'author_id' => $author->id,
            'title' => 'Anxiety Management',
            'body' => 'Tips for managing anxiety in children',
            'status' => 'published',
        ]);

        Article::factory()->create([
            'author_id' => $author->id,
            'title' => 'Depression Support',
            'body' => 'Supporting children with depression',
            'status' => 'published',
        ]);

        // Test search
        $results = Article::search('anxiety')->get();
        $this->assertCount(1, $results);
        $this->assertEquals('Anxiety Management', $results->first()->title);
    }

    public function test_article_categorization_and_audience_targeting()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'target_audience' => 'children',
            'categories' => ['mental-health', 'coping-strategies'],
            'tags' => ['anxiety', 'breathing', 'mindfulness'],
            'status' => 'published',
        ]);

        // Test audience filtering
        $childrenArticles = Article::forAudience('children')->get();
        $this->assertTrue($childrenArticles->contains($article));

        $therapistArticles = Article::forAudience('therapists')->get();
        $this->assertFalse($therapistArticles->contains($article));
    }

    public function test_article_view_tracking()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $viewer = User::factory()->create();
        $viewer->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
            'view_count' => 0,
        ]);

        // Simulate article view
        $article->views()->create([
            'user_id' => $viewer->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test Browser',
        ]);

        $article->incrementViews();

        $article->refresh();
        $this->assertEquals(1, $article->view_count);
        $this->assertCount(1, $article->views);
    }

    public function test_article_bookmarking()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
        ]);

        // Bookmark article
        $article->bookmarks()->create(['user_id' => $user->id]);

        $this->assertCount(1, $article->bookmarks);
        $this->assertTrue($user->bookmarks()->where('article_id', $article->id)->exists());
    }

    public function test_content_analytics_generation()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
            'view_count' => 100,
            'published_at' => now()->subDays(7),
        ]);

        // Add some views and bookmarks
        $article->views()->createMany([
            ['user_id' => User::factory()->create()->id, 'viewed_at' => now()->subDays(3)],
            ['user_id' => User::factory()->create()->id, 'viewed_at' => now()->subDays(1)],
        ]);

        $article->bookmarks()->create(['user_id' => User::factory()->create()->id]);

        // Get analytics
        $analytics = $this->analyticsService->getArticleAnalytics($article);

        $this->assertEquals($article->id, $analytics['article_id']);
        $this->assertEquals(100, $analytics['total_views']);
        $this->assertEquals(1, $analytics['total_bookmarks']);
        $this->assertArrayHasKey('views_last_7_days', $analytics);
        $this->assertArrayHasKey('engagement_rate', $analytics);
    }

    public function test_author_analytics_generation()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        // Create multiple articles
        Article::factory()->count(3)->create([
            'author_id' => $author->id,
            'status' => 'published',
            'view_count' => 50,
        ]);

        Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'draft',
        ]);

        $analytics = $this->analyticsService->getAuthorAnalytics($author);

        $this->assertEquals($author->id, $analytics['author_id']);
        $this->assertEquals(4, $analytics['total_articles']);
        $this->assertEquals(3, $analytics['published_articles']);
        $this->assertEquals(1, $analytics['draft_articles']);
        $this->assertEquals(150, $analytics['total_views']); // 3 * 50
    }

    public function test_content_archiving()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        // Create old article with low views
        $oldArticle = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
            'published_at' => now()->subYear(),
            'view_count' => 5,
        ]);

        // Archive old articles
        $archivedCount = $this->analyticsService->archiveOldArticles(365, 10);

        $this->assertEquals(1, $archivedCount);
        
        $oldArticle->refresh();
        $this->assertEquals('archived', $oldArticle->status);
    }

    public function test_reading_time_calculation()
    {
        $content = str_repeat('word ', 200); // 200 words
        $readingTime = Article::calculateReadingTime($content);

        $this->assertEquals(1, $readingTime); // 200 words / 200 wpm = 1 minute
    }

    public function test_slug_generation()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'title' => 'How to Help Your Child with Anxiety',
        ]);

        $this->assertEquals('how-to-help-your-child-with-anxiety', $article->slug);
    }

    public function test_platform_wide_analytics()
    {
        $author1 = User::factory()->create();
        $author1->assignRole('therapist');
        
        $author2 = User::factory()->create();
        $author2->assignRole('admin');

        // Create articles by different authors
        Article::factory()->count(2)->create([
            'author_id' => $author1->id,
            'status' => 'published',
            'view_count' => 100,
        ]);

        Article::factory()->create([
            'author_id' => $author2->id,
            'status' => 'pending',
        ]);

        $analytics = $this->analyticsService->getPlatformAnalytics();

        $this->assertEquals(3, $analytics['total_articles']);
        $this->assertEquals(2, $analytics['published_articles']);
        $this->assertEquals(1, $analytics['pending_review']);
        $this->assertEquals(200, $analytics['total_views']);
        $this->assertEquals(2, $analytics['total_authors']);
    }
}