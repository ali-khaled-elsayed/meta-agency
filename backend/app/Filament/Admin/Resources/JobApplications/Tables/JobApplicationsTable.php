<?php

namespace App\Filament\Admin\Resources\JobApplications\Tables;

use App\Filament\Admin\Resources\JobApplications\JobApplicationResource;
use App\Models\JobApplication;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class JobApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('first_name')->label('Name')
                    ->formatStateUsing(fn (JobApplication $record) => $record->full_name)
                    ->searchable(['first_name', 'last_name']),
                TextColumn::make('email')->searchable()->copyable(),
                TextColumn::make('phone')->toggleable(),
                TextColumn::make('position')->placeholder('General')->searchable(),
                TextColumn::make('status')->badge()
                    ->formatStateUsing(fn (string $state) => JobApplication::STATUSES[$state] ?? $state)
                    ->color(fn (string $state) => match ($state) {
                        'new' => 'info',
                        'shortlisted', 'interview' => 'warning',
                        'hired' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')->label('Submitted')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(JobApplication::STATUSES),
                SelectFilter::make('job_posting_id')->label('Job')->relationship('jobPosting', 'slug'),
            ])
            ->recordActions([
                JobApplicationResource::downloadCvAction(),
                EditAction::make()->label('Review'),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
