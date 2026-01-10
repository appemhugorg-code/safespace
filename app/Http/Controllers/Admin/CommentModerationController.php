<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleComment;
use App\Services\ArticleCommentService;
use Illuminate\Http\Request;

class CommentModerationController extends Controller
{
    protected ArticleCommentService $commentService;

    public function __construct(ArticleCommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    /**
     * Get pending comments for moderation.
     */
    public function index()
    {
        $pendingComments = $this->commentService->getPendingComments();

        return response()->json([
            'comments' => $pendingComments,
            'count' => $pendingComments->count(),
        ]);
    }

    /**
     * Approve a comment.
     */
    public function approve(ArticleComment $comment, Request $request)
    {
        try {
            $this->commentService->approveComment($comment, $request->user());

            return response()->json(['message' => 'Comment approved successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject a comment.
     */
    public function reject(ArticleComment $comment, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->commentService->rejectComment($comment, $request->user(), $request->reason);

            return response()->json(['message' => 'Comment rejected']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a comment.
     */
    public function destroy(ArticleComment $comment)
    {
        try {
            $this->commentService->deleteComment($comment);

            return response()->json(['message' => 'Comment deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
