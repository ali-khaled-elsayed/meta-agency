<?php

namespace App\Http\Resources;

use App\Support\HtmlSanitizer;
use App\Support\Media;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    protected function t(string $attribute): mixed
    {
        return $this->resource->translate($attribute);
    }

    protected function html(string $attribute): ?string
    {
        return HtmlSanitizer::clean($this->t($attribute));
    }

    protected function media(?string $path): ?string
    {
        return Media::url($path);
    }

    /**
     * @return array<int, string>
     */
    protected function tList(string $attribute): array
    {
        return array_values(array_filter((array) ($this->t($attribute) ?? []), fn ($item) => filled($item)));
    }

    protected function seo(): array
    {
        return $this->resource->seoFor();
    }
}
