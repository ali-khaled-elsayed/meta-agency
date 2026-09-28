<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetApiLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('app.supported_locales', ['en']);
        $requested = $request->query('locale') ?? $request->getPreferredLanguage($supported);
        $locale = in_array($requested, $supported, true) ? $requested : config('app.fallback_locale', 'en');

        app()->setLocale($locale);

        $response = $next($request);
        $response->headers->set('Content-Language', $locale);
        $response->headers->set('Vary', trim($response->headers->get('Vary').', Accept-Language', ', '));

        return $response;
    }
}
