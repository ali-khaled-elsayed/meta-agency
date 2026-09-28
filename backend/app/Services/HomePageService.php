<?php

namespace App\Services;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\ClientResource;
use App\Http\Resources\HighlightResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\StatisticResource;
use App\Http\Resources\TestimonialResource;
use App\Models\BlogPost;
use App\Models\Client;
use App\Models\Highlight;
use App\Models\HomeSection;
use App\Models\Project;
use App\Models\Service;
use App\Models\Statistic;
use App\Models\Testimonial;
use App\Support\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class HomePageService
{
    /**
     * Enabled sections in admin-defined order. Sections whose data source is empty are dropped
     * so the frontend never renders an empty block.
     */
    public function sections(): Collection
    {
        return HomeSection::query()->enabled()->get()
            ->map(fn (HomeSection $section) => $this->present($section))
            ->filter(fn (array $section) => $section['type'] === 'hero' || $section['type'] === 'cta' || $section['type'] === 'introduction' || count($section['items']) > 0)
            ->values();
    }

    private function present(HomeSection $section): array
    {
        return [
            'id' => $section->id,
            'type' => $section->type,
            'eyebrow' => $section->translate('eyebrow'),
            'title' => $section->translate('title'),
            'description' => $section->translate('description'),
            'image' => Media::url($section->image),
            'video_url' => $section->video_url,
            'cta' => $this->cta($section, 'cta'),
            'secondary_cta' => $this->cta($section, 'secondary_cta'),
            'items' => $this->items($section),
            'statistics' => in_array($section->type, ['introduction', 'hero'], true)
                ? StatisticResource::collection(Statistic::query()->active()->ordered()->get())->resolve()
                : [],
        ];
    }

    private function cta(HomeSection $section, string $key): ?array
    {
        $label = $section->setting("$key.label.".app()->getLocale()) ?: $section->setting("$key.label.".config('app.fallback_locale'));
        $url = $section->setting("$key.url");

        return filled($label) && filled($url) ? ['label' => $label, 'url' => $url] : null;
    }

    private function items(HomeSection $section): array
    {
        $ids = array_filter((array) $section->setting('item_ids', []));
        $limit = (int) $section->setting('limit', 0) ?: null;

        return match ($section->type) {
            'client_marquee' => ClientResource::collection(
                Client::query()->active()->ordered()->when($ids, fn (Builder $q) => $q->whereIn('id', $ids))->get()
            )->resolve(),
            'statistics' => StatisticResource::collection(Statistic::query()->active()->ordered()->get())->resolve(),
            'services' => ServiceResource::collection(
                $this->selected(Service::query()->active()->ordered(), $ids, $limit)
            )->resolve(),
            'projects' => ProjectResource::collection(
                $this->selected(Project::query()->active()->with(['client', 'service'])->when(! $ids, fn (Builder $q) => $q->where('is_featured', true))->ordered(), $ids, $limit ?? 6)
            )->resolve(),
            'why_meta' => HighlightResource::collection(Highlight::query()->active()->inGroup('why_meta')->ordered()->get())->resolve(),
            'testimonials' => TestimonialResource::collection(
                $this->selected(Testimonial::query()->active()->ordered(), $ids, $limit)
            )->resolve(),
            'blog' => BlogPostResource::collection(
                BlogPost::query()->published()->with('category')->latest('published_at')->limit($limit ?? 3)->get()
            )->resolve(),
            default => [],
        };
    }

    private function selected(Builder $query, array $ids, ?int $limit): Collection
    {
        if ($ids) {
            $order = array_flip(array_map('intval', $ids));

            return $query->whereIn('id', $ids)->get()->sortBy(fn ($model) => $order[$model->id] ?? PHP_INT_MAX)->values();
        }

        return $query->when($limit, fn (Builder $q) => $q->limit($limit))->get();
    }
}
