<?php

namespace App\Models\Concerns;

use App\Jobs\RevalidateFrontend;

/**
 * Tells the Next.js frontend to drop cached API responses whenever content changes.
 * Models may override `revalidationTags()`; the default tag is the table name.
 */
trait RevalidatesFrontend
{
    public static function bootRevalidatesFrontend(): void
    {
        $dispatch = fn ($model) => RevalidateFrontend::dispatch($model->revalidationTags());

        static::saved($dispatch);
        static::deleted($dispatch);
    }

    public function revalidationTags(): array
    {
        return [$this->getTable()];
    }
}
