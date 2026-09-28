<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');
            $table->json('short_title')->nullable();
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->json('capabilities')->nullable();
            $table->json('process')->nullable();
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->json('gallery')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('logo');
            $table->string('website_url')->nullable();
            $table->string('category')->nullable()->index();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('year')->nullable();
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->json('gallery')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->json('quote');
            $table->string('author_name');
            $table->json('author_position')->nullable();
            $table->string('company')->nullable();
            $table->string('avatar')->nullable();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('position')->nullable();
            $table->json('bio')->nullable();
            $table->string('photo')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['team_members', 'testimonials', 'projects', 'clients', 'services'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
