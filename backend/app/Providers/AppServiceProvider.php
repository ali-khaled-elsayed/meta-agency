<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());

        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));

        RateLimiter::for('forms', fn (Request $request) => [
            Limit::perMinute(5)->by('forms-minute:'.$request->ip()),
            Limit::perHour(30)->by('forms-hour:'.$request->ip()),
        ]);
    }
}
