<?php

namespace App\Http\Controllers\API;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::with('user')->paginate(10); 
        return response()->json([
            $comments,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'content_comment' => 'required|string',
            'post_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);
        Comment::create($request->all());
        return response()->json([
            'status' => 'Création effectuée avec succès'
        ]);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès'
        ]);
    }
}
