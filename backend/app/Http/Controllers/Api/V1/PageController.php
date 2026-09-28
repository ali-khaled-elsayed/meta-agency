<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Services\HomePageService;

class PageController extends Controller
{
    public function show(string $slug, HomePageService $home): PageResource
    {
        $page = Page::query()->active()->where('slug', $slug)->firstOrFail();

        $resource = new PageResource($page);

        return $slug === 'home'
            ? $resource->additional(['sections' => $home->sections()])
            : $resource;
    }
}
