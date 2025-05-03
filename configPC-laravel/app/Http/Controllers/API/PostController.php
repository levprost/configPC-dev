<?php

namespace App\Http\Controllers\API;

use App\Models\Post;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user', 'media')->paginate(10);
        return response()->json($posts);
    }
    public function last()
    {
        $lastPost = Post::latest()->first();
        return response()->json($lastPost);
    }
    public function indexPublished()
    {
        $posts = Post::where('is_published', true)->get()->load('media', 'usre');
        return response()->json($posts);
    }
    public function indexOrder()
    {
        $posts = Post::with('media')
            ->whereNotNull('order_post')
            ->orderBy('order_post', 'asc')
            ->get();

        return response()->json($posts);
    }
    public function indexHome()
    {
        $posts = Post::with('media')->take(4)->get();
        return response()->json($posts);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    $formFields = $request->validate([
            'title_post' => 'required|string',
            'content_post' => 'required',
            'content_post_1' => 'required',
            'content_post_2' => 'required',
            'subtitle_post' => 'required|string',
            'description_post' => 'required|string',
            'is_published' => 'required',
            'order_post' => 'nullable|integer|min:1|max:10',
        ]);
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }
        $formFields['user_id'] = $user->id;
        $newPost = Post::create($formFields);
        return response()->json([
            'status' => 'Création effectuée avec succès',
            'newPost' => $newPost
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {

        $post->load(['media', 'user', 'comments.user']);
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);
        $formFields = $request->validate([
            'title_post' => 'sometimes|string',
            'content_post' => 'sometimes',
            'content_post_1' => 'sometimes',
            'content_post_2' => 'sometimes',
            'subtitle_post' => 'sometimes|string',
            'description_post' => 'sometimes|string',
            'is_published' => 'sometimes|boolean',
            'order_post' => 'sometimes|integer',
        ]);

        $nickName = $post->user ? $post->user->nick_name : null;
        $post->update($formFields);
        return response()->json([
            'status' => 'Mise à jour effectuée avec succès',
            'new_post' => $post,
            'nick_name' => $nickName,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Post $post)
    {
        $this->authorize('delete', $post);
        $post->load('media'); 
        foreach ($post->media as $media) {
            if ($media->media_file && Storage::exists('uploads/' . $media->media_file)) {
                Storage::delete('uploads/' . $media->media_file);
            }
        }
        Media::where('post_id', $post->id)->delete();
        Comment::where('post_id', $post->id)->delete();
        $post->delete();
        return response()->json([
            'status' => 'Suppression effectuée avec succès',
            'postData' => $post,
        ]);
    }
}
