<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Service;
use Database\Seeders\Concerns\PublishesSeedAssets;
use Illuminate\Database\Seeder;

/**
 * Sample case-study entries, one per core service, published so the "Latest work" section has content.
 * Meta Egypt has no published portfolio yet, so these give the admin a ready-made structure (cover,
 * gallery, video, write-up) to replace with real client work. No client or year is attributed on purpose.
 */
class ProjectSeeder extends Seeder
{
    use PublishesSeedAssets;

    private const VIDEO = 'https://meta-egypt-agency.com/wp-content/uploads/2025/06/mm.mp4';

    public function run(): void
    {
        $projects = [
            [
                'slug' => 'sample-brand-identity',
                'service' => 'strategic-branding',
                'title' => ['en' => 'Sample: Brand identity & positioning', 'ar' => 'نموذج: الهوية والتموضع للعلامة التجارية'],
                'excerpt' => ['en' => 'Template case study for a branding engagement: strategy, identity system and launch.', 'ar' => 'دراسة حالة نموذجية لمشروع علامة تجارية: الاستراتيجية ونظام الهوية والإطلاق.'],
                'gallery' => ['innovative-design-and-creativity', 'content-creation', 'high-quality-photography'],
            ],
            [
                'slug' => 'sample-social-media-campaign',
                'service' => 'social-media-campaigns',
                'title' => ['en' => 'Sample: Social media launch campaign', 'ar' => 'نموذج: حملة إطلاق على وسائل التواصل'],
                'excerpt' => ['en' => 'Template case study for a paid and organic social campaign across Instagram, Facebook and Google Ads.', 'ar' => 'دراسة حالة نموذجية لحملة مدفوعة وعضوية على إنستجرام وفيسبوك وإعلانات جوجل.'],
                'gallery' => ['digital-marketing', 'content-creation', 'reputation-management'],
            ],
            [
                'slug' => 'sample-video-production',
                'service' => 'content-creation',
                'title' => ['en' => 'Sample: Video & content production', 'ar' => 'نموذج: إنتاج الفيديو والمحتوى'],
                'excerpt' => ['en' => 'Template case study for a content series: concept, shoot, edit and distribution.', 'ar' => 'دراسة حالة نموذجية لسلسلة محتوى: الفكرة والتصوير والمونتاج والنشر.'],
                'gallery' => ['high-quality-photography', 'social-media-campaigns', 'innovative-design-and-creativity'],
            ],
            [
                'slug' => 'sample-website-launch',
                'service' => 'web-development-mobile-apps',
                'title' => ['en' => 'Sample: Website design & development', 'ar' => 'نموذج: تصميم وتطوير موقع إلكتروني'],
                'excerpt' => ['en' => 'Template case study for a website build: UX, design, development and SEO setup.', 'ar' => 'دراسة حالة نموذجية لبناء موقع: تجربة المستخدم والتصميم والتطوير وتهيئة محركات البحث.'],
                'gallery' => ['search-engine-optimization-seo', 'innovative-design-and-creativity', 'digital-marketing'],
            ],
            [
                'slug' => 'sample-property-photography',
                'service' => 'high-quality-photography',
                'title' => ['en' => 'Sample: Property photography', 'ar' => 'نموذج: تصوير العقارات'],
                'excerpt' => ['en' => 'Template case study for a photography project: shot list, production and final selects.', 'ar' => 'دراسة حالة نموذجية لمشروع تصوير: قائمة اللقطات والإنتاج والاختيارات النهائية.'],
                'gallery' => ['content-creation', 'strategic-branding', 'public-relations'],
            ],
            [
                'slug' => 'sample-performance-marketing',
                'service' => 'digital-marketing',
                'title' => ['en' => 'Sample: Performance marketing & SEO', 'ar' => 'نموذج: التسويق بالأداء وتحسين محركات البحث'],
                'excerpt' => ['en' => 'Template case study for an always-on digital programme: search, paid media and email.', 'ar' => 'دراسة حالة نموذجية لبرنامج رقمي مستمر: البحث والإعلانات المدفوعة والبريد الإلكتروني.'],
                'gallery' => ['search-engine-optimization-seo', 'email-marketing', 'social-media-campaigns'],
            ],
        ];

        $services = Service::query()->pluck('id', 'slug');

        foreach ($projects as $order => $project) {
            Project::query()->firstOrCreate(['slug' => $project['slug']], [
                'title' => $project['title'],
                'excerpt' => $project['excerpt'],
                'body' => ['en' => $this->bodyEn(), 'ar' => $this->bodyAr()],
                'service_id' => $services[$project['service']] ?? null,
                'image' => $this->publishAsset("services/{$project['service']}.jpg"),
                'gallery' => array_map(fn (string $slug) => $this->publishAsset("services/$slug.jpg"), $project['gallery']),
                'video_url' => self::VIDEO,
                'is_featured' => $order < 3,
                'is_active' => true,
                'sort_order' => $order + 1,
            ]);
        }
    }

    private function bodyEn(): string
    {
        return <<<'HTML'
<p><strong>Sample content: replace with the real case study before publishing.</strong></p>
<h2>The brief</h2>
<p>[Who the client is, what they needed and why it mattered.]</p>
<h2>Our approach</h2>
<p>[Research, strategy and the creative idea behind the work.]</p>
<ul>
<li>[Key deliverable one]</li>
<li>[Key deliverable two]</li>
<li>[Key deliverable three]</li>
</ul>
<h2>The results</h2>
<p>[Verified outcomes only: reach, engagement, leads or sales, with the client's approval.]</p>
HTML;
    }

    private function bodyAr(): string
    {
        return <<<'HTML'
<p><strong>محتوى نموذجي: استبدله بدراسة الحالة الحقيقية قبل النشر.</strong></p>
<h2>التحدي</h2>
<p>[من هو العميل، وما الذي احتاجه، ولماذا كان ذلك مهمًا.]</p>
<h2>منهجنا</h2>
<p>[البحث والاستراتيجية والفكرة الإبداعية وراء العمل.]</p>
<ul>
<li>[المُخرج الأول]</li>
<li>[المُخرج الثاني]</li>
<li>[المُخرج الثالث]</li>
</ul>
<h2>النتائج</h2>
<p>[نتائج موثقة فقط: الوصول والتفاعل والعملاء المحتملون أو المبيعات، بموافقة العميل.]</p>
HTML;
    }
}
