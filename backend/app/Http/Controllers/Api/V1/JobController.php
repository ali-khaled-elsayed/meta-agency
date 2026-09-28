<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobPostingDetailResource;
use App\Http\Resources\JobPostingResource;
use App\Models\JobPosting;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return JobPostingResource::collection(JobPosting::query()->open()->ordered()->get());
    }

    public function show(string $slug): JobPostingDetailResource
    {
        return new JobPostingDetailResource(JobPosting::query()->open()->where('slug', $slug)->firstOrFail());
    }
}
