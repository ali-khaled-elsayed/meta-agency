<?php

use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::middleware('throttle:api')->group(function () {
        Route::get('settings', SettingsController::class)->name('settings');
        Route::get('pages/{slug}', [PageController::class, 'show'])->name('pages.show');

        Route::get('services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('services/{slug}', [ServiceController::class, 'show'])->name('services.show');

        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::get('projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

        Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
        Route::get('blog/categories', [BlogController::class, 'categories'])->name('blog.categories');
        Route::get('blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

        Route::get('jobs', [JobController::class, 'index'])->name('jobs.index');
        Route::get('jobs/{slug}', [JobController::class, 'show'])->name('jobs.show');

        Route::get('clients', [CollectionController::class, 'clients'])->name('clients');
        Route::get('testimonials', [CollectionController::class, 'testimonials'])->name('testimonials');
        Route::get('team', [CollectionController::class, 'team'])->name('team');
        Route::get('highlights', [CollectionController::class, 'highlights'])->name('highlights');
        Route::get('faqs', [CollectionController::class, 'faqs'])->name('faqs');
        Route::get('redirects', [CollectionController::class, 'redirects'])->name('redirects');
    });

    Route::middleware('throttle:forms')->group(function () {
        Route::post('contact', [SubmissionController::class, 'contact'])->name('contact.store');
        Route::post('job-applications', [SubmissionController::class, 'jobApplication'])->name('job-applications.store');
    });
});
