<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'service' => ['nullable', 'string', 'max:100'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $projects = Project::query()->active()->ordered()->with(['client', 'service'])
            ->when($request->query('service'), fn ($q, $slug) => $q->whereHas('service', fn ($s) => $s->where('slug', $slug)))
            ->when($request->boolean('featured'), fn ($q) => $q->where('is_featured', true))
            ->get();

        return ProjectResource::collection($projects);
    }

    public function show(string $slug): ProjectDetailResource
    {
        $project = Project::query()->active()->where('slug', $slug)->with(['client', 'service'])->firstOrFail();

        $related = Project::query()->active()->ordered()->with(['client', 'service'])
            ->whereKeyNot($project->id)
            ->when($project->service_id, fn ($q) => $q->orderByRaw('service_id = ? desc', [$project->service_id]))
            ->limit(3)->get();

        return (new ProjectDetailResource($project))->additional([
            'related' => ProjectResource::collection($related),
        ]);
    }
}
