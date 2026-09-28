<?php

namespace Tests\Unit;

use App\Models\Service;
use Tests\TestCase;

class HasTranslationsTest extends TestCase
{
    public function test_it_returns_the_requested_locale_and_falls_back_to_english(): void
    {
        $service = new Service(['title' => ['en' => 'Branding', 'ar' => 'الهوية'], 'excerpt' => ['en' => 'Only English', 'ar' => '']]);

        $this->assertSame('الهوية', $service->translate('title', 'ar'));
        $this->assertSame('Only English', $service->translate('excerpt', 'ar'));
        $this->assertTrue($service->hasTranslation('title', 'ar'));
        $this->assertFalse($service->hasTranslation('excerpt', 'ar'));
        $this->assertNull($service->translate('body', 'ar'));
    }

    public function test_seo_falls_back_per_field(): void
    {
        $service = new Service(['seo' => ['title' => ['en' => 'EN title', 'ar' => 'عنوان'], 'description' => ['en' => 'EN description']]]);

        app()->setLocale('ar');
        $seo = $service->seoFor();

        $this->assertSame('عنوان', $seo['title']);
        $this->assertSame('EN description', $seo['description']);
        $this->assertFalse($seo['noindex']);
    }
}
