<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer as SymfonySanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class HtmlSanitizer
{
    private static ?SymfonySanitizer $sanitizer = null;

    public static function clean(?string $html): ?string
    {
        if (blank($html)) {
            return null;
        }

        return self::sanitizer()->sanitize($html);
    }

    private static function sanitizer(): SymfonySanitizer
    {
        return self::$sanitizer ??= new SymfonySanitizer(
            (new HtmlSanitizerConfig)
                ->allowSafeElements()
                ->allowElement('a', ['href', 'title', 'target', 'rel'])
                ->allowElement('img', ['src', 'alt', 'width', 'height', 'loading'])
                ->allowElement('iframe', ['src', 'title', 'allow', 'allowfullscreen', 'width', 'height'])
                ->allowLinkSchemes(['https', 'http', 'mailto', 'tel'])
                ->allowMediaSchemes(['https', 'http'])
                ->allowMediaHosts(array_filter([
                    parse_url((string) config('app.url'), PHP_URL_HOST),
                    'www.youtube.com',
                    'www.youtube-nocookie.com',
                    'player.vimeo.com',
                ]))
                ->forceAttribute('a', 'rel', 'noopener noreferrer')
                ->withMaxInputLength(500_000)
        );
    }
}
