<?php

namespace App\Filament\Admin\Resources\JobApplications\Schemas;

use App\Models\JobApplication;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Applications are submitted from the website; admins can only review them and update status/notes.
 */
class JobApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make('Applicant')->columnSpan(2)->columns(2)->schema([
                    TextEntry::make('full_name')->label('Name'),
                    TextEntry::make('position')->placeholder('General application'),
                    TextEntry::make('email')->copyable()->url(fn (JobApplication $record) => "mailto:{$record->email}"),
                    TextEntry::make('phone')->copyable(),
                    TextEntry::make('city')->placeholder('—'),
                    TextEntry::make('country')->placeholder('—'),
                    TextEntry::make('linkedin_url')->label('LinkedIn')->placeholder('—')->url(fn ($state) => $state, true),
                    TextEntry::make('portfolio_url')->label('Portfolio')->placeholder('—')->url(fn ($state) => $state, true),
                    TextEntry::make('expected_salary')->placeholder('—'),
                    TextEntry::make('available_from')->date()->placeholder('—'),
                    TextEntry::make('english_level')->placeholder('—'),
                    TextEntry::make('source')->label('Heard about us via')->placeholder('—'),
                    TextEntry::make('cv_original_name')->label('CV file'),
                    TextEntry::make('created_at')->label('Submitted')->dateTime(),
                    TextEntry::make('message')->placeholder('No message')->columnSpanFull(),
                ]),
                Section::make('Review')->columnSpan(1)->schema([
                    Select::make('status')->options(JobApplication::STATUSES)->required()->native(false),
                    Textarea::make('admin_notes')->label('Internal notes')->rows(8)->maxLength(5000),
                ]),
            ]),
        ]);
    }
}
