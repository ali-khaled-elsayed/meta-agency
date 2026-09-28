<?php

namespace App\Filament\Admin\Widgets;

use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class InboxOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('New contact messages', ContactMessage::query()->where('status', 'new')->count())
                ->description(ContactMessage::query()->where('created_at', '>=', now()->subDays(30))->count().' in the last 30 days')
                ->icon('heroicon-o-envelope'),
            Stat::make('New job applications', JobApplication::query()->where('status', 'new')->count())
                ->description(JobApplication::query()->where('created_at', '>=', now()->subDays(30))->count().' in the last 30 days')
                ->icon('heroicon-o-inbox-arrow-down'),
            Stat::make('Open jobs', JobPosting::query()->open()->count())->icon('heroicon-o-briefcase'),
            Stat::make('Published posts', BlogPost::query()->published()->count())->icon('heroicon-o-newspaper'),
        ];
    }
}
