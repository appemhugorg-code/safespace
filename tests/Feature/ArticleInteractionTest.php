<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleComment;
use App\Models\ArticleRating;
use App\Models\ContentNewsletter;
use App\Models\User;
use App\Services\ArticleCommentService;
use App\Services\ArticleRatingService;
use App\Services\ContentNewsletterService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleInteractionTest extends TestCase
{
    use RefreshDatabase;

    protected ArticleCommentService $commentService;
    protected ArticleRatingService $ratingService;
    protected ContentNewsletterService $newsletterService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        
        $this->commentService = app(ArticleCommentService::class);
        $this->ratingService = app(ArticleRatingService::class);
        $this->newsletterService = app(ContentNewsletterService::class);
    }

    // ========== Comment System Tests ==========

    public function test_user_can_create_comment()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $commenter = User::factory()->create();
        $commenter->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
        ]);

        $comment = $this->commentService->createComment(
            $article,
            $commenter,
            'This is a helpful article!'
        );

        $this->assertInstanceOf(ArticleComment::class, $comment);
        $this->assertEquals('pending', $comment->status);
        $this->assertEquals($article->id, $comment->article_id);
        $this->assertEquals($commenter->id, $comment->user_id);
    }

    public function test_user_can_reply_to_comment()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $commenter = User::factory()->create();
        $commenter->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
        ]);

        // Create parent comment
        $parentComment = $this->commentService->createComment(
            $article,
            $commenter,
            'Great article!'
        );

        // Create reply
        $reply = $this->commentService->createComment(
            $article,
            $author,
            'Thank you for the feedback!',
            $parentComment->id
        );

        $this->assertEquals($parentComment->id, $reply->parent_id);
        $this->assertTrue($reply->isReply());
    }

    public function test_admin_can_approve_comment()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $commenter = User::factory()->create();
        $commenter->assignRole('guardian');

        $article = Article::factory()->create(['status' => 'published']);

        $comment = ArticleComment::factory()->create([
            'article_id' => $article->id,
            'user_id' => $commenter->id,
            'status' => 'pending',
        ]);

        $this->commentService->approveComment($comment, $admin);

        $comment->refresh();
        $this->assertEquals('approved', $comment->status);
        $this->assertEquals($admin->id, $comment->moderated_by);
        $this->assertNotNull($comment->moderated_at);
    }

    public function test_admin_can_reject_comment()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $commenter = User::factory()->create();
        $commenter->assignRole('guardian');

        $article = Article::factory()->create(['status' => 'published']);

        $comment = ArticleComment::factory()->create([
            'article_id' => $article->id,
            'user_id' => $commenter->id,
            'status' => 'pending',
        ]);

        $reason = 'Inappropriate content';
        $this->commentService->rejectComment($comment, $admin, $reason);

        $comment->refresh();
        $this->assertEquals('rejected', $comment->status);
        $this->assertEquals($reason, $comment->moderation_reason);
    }

    public function test_comment_can_be_flagged()
    {
        $commenter = User::factory()->create();
        $commenter->assignRole('guardian');

        $article = Article::factory()->create(['status' => 'published']);

        $comment = ArticleComment::factory()->create([
            'article_id' => $article->id,
            'user_id' => $commenter->id,
            'status' => 'approved',
        ]);

        $reason = 'Spam content';
        $this->commentService->flagComment($comment, $reason);

        $comment->refresh();
        $this->assertEquals('flagged', $comment->status);
        $this->assertEquals($reason, $comment->moderation_reason);
    }

    public function test_only_approved_comments_are_displayed()
    {
        $article = Article::factory()->create(['status' => 'published']);

        // Create comments with different statuses
        ArticleComment::factory()->create([
            'article_id' => $article->id,
            'status' => 'approved',
        ]);

        ArticleComment::factory()->create([
            'article_id' => $article->id,
            'status' => 'pending',
        ]);

        ArticleComment::factory()->create([
            'article_id' => $article->id,
            'status' => 'rejected',
        ]);

        $comments = $this->commentService->getArticleComments($article);

        $this->assertCount(1, $comments);
        $this->assertEquals('approved', $comments->first()->status);
    }

    // ========== Rating System Tests ==========

    public function test_user_can_rate_article()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $rater = User::factory()->create();
        $rater->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
        ]);

        $rating = $this->ratingService->rateArticle(
            $article,
            $rater,
            5,
            'Excellent article!'
        );

        $this->assertInstanceOf(ArticleRating::class, $rating);
        $this->assertEquals(5, $rating->rating);
        $this->assertEquals('Excellent article!', $rating->feedback);
    }

    public function test_user_can_update_existing_rating()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');
        
        $rater = User::factory()->create();
        $rater->assignRole('guardian');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
        ]);

        // First rating
        $this->ratingService->rateArticle($article, $rater, 4, 'Good article');

        // Update rating
        $updatedRating = $this->ratingService->rateArticle($article, $rater, 5, 'Actually, excellent!');

        $this->assertEquals(5, $updatedRating->rating);
        $this->assertEquals('Actually, excellent!', $updatedRating->feedback);

        // Should only have one rating per user per article
        $this->assertEquals(1, $article->ratings()->count());
    }

    public function test_rating_statistics_are_calculated_correctly()
    {
        $article = Article::factory()->create(['status' => 'published']);

        // Create multiple ratings
        ArticleRating::factory()->create(['article_id' => $article->id, 'rating' => 5]);
        ArticleRating::factory()->create(['article_id' => $article->id, 'rating' => 4]);
        ArticleRating::factory()->create(['article_id' => $article->id, 'rating' => 5]);
        ArticleRating::factory()->create(['article_id' => $article->id, 'rating' => 3]);

        $stats = $this->ratingService->getRatingStats($article);

        $this->assertEquals(4.25, $stats['average_rating']); // (5+4+5+3)/4 = 4.25
        $this->assertEquals(4, $stats['total_ratings']);
        $this->assertEquals(2, $stats['distribution'][5]);
        $this->assertEquals(1, $stats['distribution'][4]);
        $this->assertEquals(1, $stats['distribution'][3]);
        $this->assertEquals(50.0, $stats['percentage_5_star']); // 2/4 * 100
    }

    public function test_top_rated_articles_are_retrieved()
    {
        // Create articles with different ratings
        $article1 = Article::factory()->create(['status' => 'published']);
        $article2 = Article::factory()->create(['status' => 'published']);
        $article3 = Article::factory()->create(['status' => 'published']);

        // Article 1: Average 5.0
        ArticleRating::factory()->create(['article_id' => $article1->id, 'rating' => 5]);
        ArticleRating::factory()->create(['article_id' => $article1->id, 'rating' => 5]);

        // Article 2: Average 4.0
        ArticleRating::factory()->create(['article_id' => $article2->id, 'rating' => 4]);
        ArticleRating::factory()->create(['article_id' => $article2->id, 'rating' => 4]);

        // Article 3: Average 3.0
        ArticleRating::factory()->create(['article_id' => $article3->id, 'rating' => 3]);

        $topRated = $this->ratingService->getTopRatedArticles(2);

        $this->assertCount(2, $topRated);
        $this->assertEquals($article1->id, $topRated->first()->id);
        $this->assertEquals($article2->id, $topRated->get(1)->id);
    }

    // ========== Newsletter System Tests ==========

    public function test_newsletter_can_be_created()
    {
        $newsletter = $this->newsletterService->createNewsletter([
            'title' => 'Weekly Mental Health Tips',
            'description' => 'Weekly tips for mental health',
            'frequency' => 'weekly',
            'target_audience' => 'guardians',
        ]);

        $this->assertInstanceOf(ContentNewsletter::class, $newsletter);
        $this->assertEquals('Weekly Mental Health Tips', $newsletter->title);
        $this->assertEquals('weekly', $newsletter->frequency);
        $this->assertNotNull($newsletter->next_send_at);
    }

    public function test_user_can_subscribe_to_newsletter()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $newsletter = ContentNewsletter::factory()->create();

        $this->newsletterService->subscribe($newsletter, $user);

        $this->assertTrue($newsletter->subscribers()->where('user_id', $user->id)->exists());
        
        $newsletter->refresh();
        $this->assertEquals(1, $newsletter->subscriber_count);
    }

    public function test_user_can_unsubscribe_from_newsletter()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $newsletter = ContentNewsletter::factory()->create();

        // Subscribe first
        $this->newsletterService->subscribe($newsletter, $user);
        
        // Then unsubscribe
        $this->newsletterService->unsubscribe($newsletter, $user);

        $subscription = $newsletter->subscribers()
            ->where('user_id', $user->id)
            ->first();

        $this->assertFalse($subscription->pivot->is_subscribed);
    }

    public function test_newsletter_content_is_prepared_correctly()
    {
        $newsletter = ContentNewsletter::factory()->create([
            'target_audience' => 'guardians',
            'frequency' => 'weekly',
        ]);

        // Create articles for different audiences
        Article::factory()->create([
            'status' => 'published',
            'target_audience' => 'guardians',
            'published_at' => now()->subDays(1),
        ]);

        Article::factory()->create([
            'status' => 'published',
            'target_audience' => 'children',
            'published_at' => now()->subDays(2),
        ]);

        $content = $this->newsletterService->prepareNewsletterContent($newsletter);

        $this->assertArrayHasKey('newsletter', $content);
        $this->assertArrayHasKey('articles', $content);
        $this->assertCount(1, $content['articles']); // Only guardian-targeted article
    }

    public function test_due_newsletters_are_identified()
    {
        // Create newsletter that's due
        $dueNewsletter = ContentNewsletter::factory()->create([
            'is_active' => true,
            'next_send_at' => now()->subHour(),
        ]);

        // Create newsletter that's not due
        ContentNewsletter::factory()->create([
            'is_active' => true,
            'next_send_at' => now()->addHour(),
        ]);

        $dueNewsletters = ContentNewsletter::due()->get();

        $this->assertCount(1, $dueNewsletters);
        $this->assertEquals($dueNewsletter->id, $dueNewsletters->first()->id);
    }

    // ========== API Integration Tests ==========

    public function test_comment_api_endpoints_work()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $article = Article::factory()->create(['status' => 'published']);

        // Test creating comment via API
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/articles/{$article->id}/comments", [
                'content' => 'Great article!',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('article_comments', [
            'article_id' => $article->id,
            'user_id' => $user->id,
            'content' => 'Great article!',
        ]);
    }

    public function test_rating_api_endpoints_work()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $article = Article::factory()->create(['status' => 'published']);

        // Test rating article via API
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/articles/{$article->id}/rate", [
                'rating' => 5,
                'feedback' => 'Excellent!',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('article_ratings', [
            'article_id' => $article->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);
    }

    public function test_newsletter_api_endpoints_work()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        $newsletter = ContentNewsletter::factory()->create();

        // Test subscribing via API
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/newsletters/{$newsletter->id}/subscribe");

        $response->assertStatus(200);
        $this->assertTrue($newsletter->subscribers()->where('user_id', $user->id)->exists());
    }
}