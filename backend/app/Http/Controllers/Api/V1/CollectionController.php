<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\HighlightResource;
use App\Http\Resources\TeamMemberResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Client;
use App\Models\Faq;
use App\Models\Highlight;
use App\Models\Redirect;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

/**
 * Simple ordered, active-only listings that need no detail endpoint.
 */
class CollectionController extends Controller
{
    public function clients(): AnonymousResourceCollection
    {
        return ClientResource::collection(Client::query()->active()->ordered()->get());
    }

    public function testimonials(): AnonymousResourceCollection
    {
        return TestimonialResource::collection(Testimonial::query()->active()->ordered()->get());
    }

    public function team(): AnonymousResourceCollection
    {
        return TeamMemberResource::collection(TeamMember::query()->active()->ordered()->get());
    }

    public function highlights(Request $request): AnonymousResourceCollection
    {
        $request->validate(['group' => ['nullable', Rule::in(array_keys(Highlight::GROUPS))]]);

        return HighlightResource::collection(
            Highlight::query()->active()->ordered()
                ->when($request->query('group'), fn ($q, $group) => $q->inGroup($group))
                ->get()
        );
    }

    public function faqs(Request $request): AnonymousResourceCollection
    {
        return FaqResource::collection(
            Faq::query()->active()->ordered()
                ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
                ->get()
        );
    }

    public function redirects(): JsonResponse
    {
        return response()->json([
            'data' => Redirect::query()->where('is_active', true)->get(['from_path', 'to_path', 'status_code']),
        ]);
    }
}
