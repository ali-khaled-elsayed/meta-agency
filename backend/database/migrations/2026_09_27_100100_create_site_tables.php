<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');
            $table->json('eyebrow')->nullable();
            $table->json('intro')->nullable();
            $table->json('body')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('hero_video_url')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->json('eyebrow')->nullable();
            $table->json('title')->nullable();
            $table->json('description')->nullable();
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('value');
            $table->string('prefix', 8)->nullable();
            $table->string('suffix', 8)->nullable();
            $table->json('label');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('highlights', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index();
            $table->json('title');
            $table->json('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('map_url')->nullable();
            $table->json('hours')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('url');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->nullable()->index();
            $table->json('question');
            $table->json('answer');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('from_path')->unique();
            $table->string('to_path');
            $table->unsignedSmallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['redirects', 'faqs', 'social_links', 'offices', 'highlights', 'statistics', 'home_sections', 'pages', 'site_settings'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
