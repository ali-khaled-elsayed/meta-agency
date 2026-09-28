<?php

namespace App\Filament\Admin\Resources\JobPostings\Tables;

use App\Filament\Support\Columns;
use App\Models\JobPosting;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class JobPostingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                Columns::translated('title'),
                TextColumn::make('department.en')->label('Department')->toggleable(),
                TextColumn::make('employment_type')->badge()->formatStateUsing(fn (string $state) => JobPosting::EMPLOYMENT_TYPES[$state] ?? $state),
                TextColumn::make('applications_count')->counts('applications')->label('Applications')->sortable(),
                TextColumn::make('closes_at')->date()->placeholder('Open-ended')->sortable(),
                Columns::active()->label('Open'),
            ])
            ->filters([
                SelectFilter::make('employment_type')->options(JobPosting::EMPLOYMENT_TYPES),
                TernaryFilter::make('is_active')->label('Open'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
