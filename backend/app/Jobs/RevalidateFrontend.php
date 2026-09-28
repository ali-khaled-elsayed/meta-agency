<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class RevalidateFrontend implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    public int $backoff = 10;

    /**
     * @param  array<int, string>  $tags
     */
    public function __construct(public array $tags) {}

    public function handle(): void
    {
        $url = config('services.frontend.revalidate_url');
        $secret = config('services.frontend.revalidate_secret');

        if (blank($url) || blank($secret)) {
            return;
        }

        try {
            Http::timeout(5)
                ->withHeaders(['x-revalidate-secret' => $secret])
                ->post($url, ['tags' => $this->tags])
                ->throw();
        } catch (Throwable $e) {
            Log::warning('Frontend revalidation failed', ['tags' => $this->tags, 'error' => $e->getMessage()]);
        }
    }
}
