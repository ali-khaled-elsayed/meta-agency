<?php

namespace App\Filament\Admin\Resources\JobApplications;

use App\Filament\Admin\Resources\JobApplications\Pages\EditJobApplication;
use App\Filament\Admin\Resources\JobApplications\Pages\ListJobApplications;
use App\Filament\Admin\Resources\JobApplications\Schemas\JobApplicationForm;
use App\Filament\Admin\Resources\JobApplications\Tables\JobApplicationsTable;
use App\Models\JobApplication;
use App\Services\JobApplicationService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;
use UnitEnum;

class JobApplicationResource extends Resource
{
    protected static ?string $model = JobApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Careers';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Applications';

    protected static ?string $recordTitleAttribute = 'email';

    public static function form(Schema $schema): Schema
    {
        return JobApplicationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return JobApplicationsTable::configure($table);
    }

    public static function getNavigationBadge(): ?string
    {
        $count = JobApplication::query()->where('status', 'new')->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    /**
     * Streams the CV from the private disk; only reachable by authenticated admins through Filament.
     */
    public static function downloadCvAction(): Action
    {
        return Action::make('downloadCv')
            ->label('CV')
            ->icon(Heroicon::OutlinedArrowDownTray)
            ->visible(fn (JobApplication $record) => Storage::disk(JobApplicationService::DISK)->exists($record->cv_path))
            ->action(fn (JobApplication $record) => Storage::disk(JobApplicationService::DISK)->download($record->cv_path, $record->cv_original_name));
    }

    public static function getPages(): array
    {
        return [
            'index' => ListJobApplications::route('/'),
            'edit' => EditJobApplication::route('/{record}/edit'),
        ];
    }
}
