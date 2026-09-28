<?php

namespace App\Filament\Admin\Resources\JobPostings\Schemas;

use App\Filament\Support\Fields;
use App\Models\JobPosting;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class JobPostingForm
{
    public static function configure(Schema $schema): Schema
    {
        $list = fn (string $name, string $label, string $locale) => Repeater::make("$name.$locale")
            ->label($label)
            ->simple(TextInput::make('item')->required()->maxLength(300))
            ->reorderable()
            ->defaultItems(0)
            ->addActionLabel("Add item");

        return $schema->components([
            Grid::make(3)->columnSpanFull()->schema([
                Section::make()->columnSpan(2)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::titleWithSlug($locale, $default),
                        Grid::make(2)->schema([
                            Fields::text('department', $locale),
                            Fields::text('location', $locale, $default),
                        ]),
                        Fields::textarea('summary', $locale, rows: 4),
                        $list('responsibilities', 'Responsibilities', $locale),
                        $list('requirements', 'Requirements', $locale),
                        $list('benefits', 'Benefits', $locale),
                    ]),
                ]),
                Grid::make(1)->columnSpan(1)->schema([
                    Section::make('Job')->schema([
                        Fields::slug('job_postings'),
                        Select::make('employment_type')->options(JobPosting::EMPLOYMENT_TYPES)->default('full_time')->required()->native(false),
                        Select::make('workplace_type')->options(JobPosting::WORKPLACE_TYPES)->default('on_site')->required()->native(false),
                    ]),
                    Section::make('Visibility')->schema([
                        Toggle::make('is_active')->label('Open')->default(true),
                        DateTimePicker::make('published_at')->default(now()),
                        DatePicker::make('closes_at')->label('Closes on')->helperText('The job is hidden after this date.'),
                        TextInput::make('sort_order')->numeric()->default(0),
                    ]),
                ]),
            ]),
            Fields::seo('jobs/seo'),
        ]);
    }
}
