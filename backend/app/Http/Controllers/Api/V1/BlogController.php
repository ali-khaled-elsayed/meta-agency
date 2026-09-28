<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogCategoryResource;
use App\Http\Resources\BlogPostDetailResource;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BlogController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $locale = app()->getLocale();
        $search = $validated['search'] ?? null;

        $posts = BlogPost::query()->published()->with('category')
            ->when($validated['category'] ?? null, fn ($q, $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when($search, function ($q) use ($search, $locale) {
                $term = '%'.addcslashes($search, '%_\\').'%';
                $q->where(fn ($w) => $w
                    ->where("title->$locale", 'like', $term)
                    ->orWhere('title->en', 'like', $term)
                    ->orWhere("excerpt->$locale", 'like', $term)
                    ->orWhere('excerpt->en', 'like', $term));
            })
            ->orderByDesc('is_featured')
            ->latest('published_at')
            ->paginate($validated['per_page'] ?? 9)
            ->withQueryString();

        return BlogPostResource::collection($posts);
    }

    public function categories(): AnonymousResourceCollection
    {
        return BlogCategoryResource::collection(
            BlogCategory::query()->active()->ordered()
                ->withCount(['posts' => fn ($q) => $q->published()])
                ->get()
        );
    }

    public function show(string $slug): BlogPostDetailResource
    {
        $post = BlogPost::query()->published()->where('slug', $slug)->with('category')->firstOrFail();

        $related = BlogPost::query()->published()->with('category')
            ->whereKeyNot($post->id)
            ->when($post->blog_category_id, fn ($q) => $q->orderByRaw('blog_category_id = ? desc', [$post->blog_category_id]))
            ->latest('published_at')
            ->limit(3)->get();

        return (new BlogPostDetailResource($post))->additional([
            'related' => BlogPostResource::collection($related),
        ]);
    }
}
