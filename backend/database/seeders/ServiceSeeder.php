<?php

namespace Database\Seeders;

use App\Models\Service;
use Database\Seeders\Concerns\PublishesSeedAssets;
use Illuminate\Database\Seeder;

/**
 * The 11 services and descriptions exactly as published on meta-egypt-agency.com/our-services.
 * Capabilities and process are left empty: the live site has none and they must come from Meta Egypt.
 */
class ServiceSeeder extends Seeder
{
    use PublishesSeedAssets;

    public function run(): void
    {
        $services = [
            ['strategic-branding', 'Strategic Branding & Positioning', 'Strategic Branding', "In a competitive market, a strong brand identity is essential. We work closely with you to define your brand's unique value proposition, mission, and vision. Our experts then craft a compelling brand strategy that resonates with your audience and sets you apart from the crowd."],
            ['digital-marketing', 'Digital Marketing Excellence', 'Digital Marketing', 'Our digital marketing strategies are designed to bring your services into the digital spotlight. From SEO and content marketing to social media campaigns and pay-per-click advertising, we harness the power of digital channels to increase your online visibility and engagement.'],
            ['web-development-mobile-apps', 'Web Development & Mobile Apps', 'Web & Mobile Apps', 'In the fast-paced digital world of real estate, having a strong online presence is essential for attracting and engaging potential buyers and sellers. Our marketing agency specializes in crafting custom web development solutions tailored to the unique needs of the real estate industry.'],
            ['content-creation', 'Content Creation', 'Content Creation', 'Inform and educate your audience with valuable content. From blog posts about the latest real estate trends to guides on buying or selling properties, our content resonates with your potential clients, positioning you as an industry authority.'],
            ['high-quality-photography', 'High-Quality Photography', 'Photography', 'Highlight the features and aesthetics of your properties with professional photography. Our skilled photographers capture stunning visuals that evoke emotions and entice potential buyers to explore further.'],
            ['innovative-design-and-creativity', 'Innovative Design and Creativity', 'Creative Design', "We believe that creative design has the power to convey messages that words sometimes cannot. Our designers collaborate to create visually appealing marketing materials that align with your brand's identity and captivate your audience's attention."],
            ['social-media-campaigns', 'Social Media Campaigns', 'Social Media', 'Utilize platforms like Instagram, Facebook, and Google Ads to showcase properties, share engaging content, and run targeted ad campaigns to reach potential buyers.'],
            ['reputation-management', 'Reputation Management', 'Reputation', "Building and maintaining a positive reputation, specifically in real estate, is essential. Our reputation management strategies help you monitor and manage online reviews and mentions, ensuring that your brand's image remains positive and influential."],
            ['email-marketing', 'Email Marketing', 'Email Marketing', 'Build an email list of interested buyers and regularly send out newsletters showcasing new properties, market trends, and industry insights.'],
            ['search-engine-optimization-seo', 'Search Engine Optimization (SEO)', 'SEO', "Optimize your website and content to rank well on search engines. This will help potential clients find your agency when they're searching for real estate services."],
            ['public-relations', 'Public Relations', 'Public Relations', 'Public relations play a crucial role in enhancing the reputation, visibility, and credibility of a real estate business, integrating PR into a complete marketing offering for real estate clients.'],
        ];

        foreach ($services as $i => [$slug, $title, $short, $excerpt]) {
            Service::query()->firstOrCreate(['slug' => $slug], [
                'title' => ['en' => $title],
                'short_title' => ['en' => $short],
                'excerpt' => ['en' => $excerpt],
                'image' => $this->publishAsset("services/$slug.jpg"),
                'is_featured' => $i < 4,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
