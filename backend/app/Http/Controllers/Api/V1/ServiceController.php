<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceDetailResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceResource::collection(Service::query()->active()->ordered()->get());
    }

    public function show(string $slug): ServiceDetailResource
    {
        $service = Service::query()->active()->where('slug', $slug)
            ->with(['projects' => fn ($q) => $q->active()->ordered()->with(['client', 'service'])->limit(6)])
            ->firstOrFail();

        $siblings = Service::query()->active()->ordered()->get(['id', 'slug', 'title', 'short_title']);
        $index = $siblings->search(fn (Service $s) => $s->id === $service->id);
        $link = fn (?Service $s) => $s ? ['slug' => $s->slug, 'title' => $s->translate('short_title') ?? $s->translate('title')] : null;

        return (new ServiceDetailResource($service))->additional(['meta' => [
            'index' => $index + 1,
            'total' => $siblings->count(),
            'previous' => $link($siblings->get($index - 1) ?? $siblings->last()),
            'next' => $link($siblings->get($index + 1) ?? $siblings->first()),
        ]]);
    }
}
