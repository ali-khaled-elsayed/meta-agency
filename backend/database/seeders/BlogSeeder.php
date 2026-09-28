<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Redirect;
use Database\Seeders\Concerns\PublishesSeedAssets;
use Illuminate\Database\Seeder;

/**
 * The eight posts published on meta-egypt-agency.com/blog, imported with their titles, dates and body, and
 * original digital-marketing cover images. The live posts are the WordPress theme's sample articles and are
 * meant to be rewritten or replaced from the admin.
 */
class BlogSeeder extends Seeder
{
    use PublishesSeedAssets;

    private const EXCERPT = 'Eco-friendly construction materials are essential in building a sustainable future. These materials, such as reclaimed wood, recycled metal, and bamboo, significantly reduce the environmental impact of construction projects.';

    private const PROPOSAL = 'Once all necessary information has been gathered, start outlining this project proposal accordingly: begin with a personal introduction followed by a company overview, yours and theirs, if applicable. Emphasize the importance of pitching your web design services by clearly outlining the client’s problem or opportunity, expressing your understanding and capability, and providing a structured proposal to win the design project. Next, state briefly what work needs to be done, the timeframe, the budget, etc., and point out why you should be awarded this contract.';

    public function run(): void
    {
        $posts = [
            ['pixify-enhances-user-experience-with-innovative-design-features-in-2024', 'Pixify Enhances User Experience with Innovative Design Features in 2024', '2024-05-26 12:03:00', true],
            ['pixify-unveils-tool-redefining-corporate-visual-design-and-creativity', 'Pixify Unveils Tool, Redefining Corporate Visual Design and Creativity', '2024-05-26 12:02:00', false],
            ['pixify-partners-globally-transforming-digital-content-creation-for-businesses', 'Pixify Partners Globally, Transforming Digital Content Creation for Businesses', '2024-05-26 12:01:00', false],
            ['whats-new-corporate-agency-news-and-events', 'What’s New: Corporate Agency News and Events', '2024-05-26 12:00:00', false],
            ['corporate-milestones-key-achievements-and-announce', 'Corporate Milestones: Key Achievements and Announce', '2024-01-10 12:03:00', false],
            ['industry-trends-stay-informed-with-our-news', 'Industry Trends: Stay Informed with Our News', '2024-01-10 12:02:00', false],
            ['breaking-news-corporate-agency-announcements-and-highlights', 'Breaking News: Corporate Agency Announcements and Highlights', '2024-01-10 12:01:00', false],
            ['latest-updates-corporate-agency-news-and-insights', 'Latest Updates: Corporate Agency News and Insights', '2024-01-10 12:00:00', false],
        ];

        foreach ($posts as [$slug, $title, $publishedAt, $featured]) {
            BlogPost::query()->firstOrCreate(['slug' => $slug], [
                'title' => ['en' => $title],
                'excerpt' => ['en' => self::EXCERPT],
                'body' => ['en' => $this->body()],
                'author_name' => 'Meta Egypt Agency',
                'cover_image' => $this->publishAsset("marketing/blog/$slug.jpg"),
                'reading_minutes' => 3,
                'status' => 'published',
                'published_at' => $publishedAt,
                'is_featured' => $featured,
            ]);

            $redirect = Redirect::query()->firstOrNew(['from_path' => "/$slug"]);
            if (! $redirect->exists || $redirect->to_path === '/blog') {
                $redirect->fill(['to_path' => "/blog/$slug", 'status_code' => 301])->save();
            }
        }
    }

    private function body(): string
    {
        $proposal = self::PROPOSAL;

        return <<<HTML
        <h2>Breaking Quarterly Profits</h2>
        <p>Eco-friendly construction materials are essential in building a sustainable future. These materials, such as reclaimed wood, recycled metal, and bamboo, significantly reduce the environmental impact of construction projects. They are often sourced from renewable resources and require less energy to produce compared to traditional materials. By incorporating sustainable materials, buildings can achieve better energy efficiency and lower carbon footprints.</p>
        <p>Additionally, eco-friendly materials can improve indoor air quality and enhance the overall health and well-being of occupants. The use of green construction materials also supports the growth of a circular economy, promoting the reuse and recycling of resources. Ultimately, adopting sustainable materials in construction is a crucial step towards a more resilient and environmentally responsible built environment.</p>
        <h2>Transforming spaces and enriching lives</h2>
        <ul>
        <li>Nibh libero condimentum duis turpis pretium molestie netus turpis</li>
        <li>Molestie sem cursus pulvinar euismod pulvinar nisi at nisi consequat integer</li>
        <li>Consequat vulputate pellentesque cursus venenatis egestas.</li>
        <li>Arcu rutrum luctus libero elementum quis libero enim utgravida quis</li>
        <li>Turpis lacus sed sagittis mollis sitquam</li>
        <li>Promoting the reuse and recycling of resources</li>
        </ul>
        <blockquote><p>“I must explain to you how all this mistake idea denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.”</p></blockquote>
        <h2>Research Your Competitors</h2>
        <p>It is important to research your competition. Look at what other companies offer and how much they charge for their services. A free website proposal template can help you efficiently plan costs and time. This will give you an idea of what must be included in the proposal and how much should be charged.</p>
        <h2>Be Specific in Your Terms and Conditions</h2>
        <p>{$proposal}</p>
        <h2>Outline Your Proposal</h2>
        <p>{$proposal}</p>
        HTML;
    }
}
