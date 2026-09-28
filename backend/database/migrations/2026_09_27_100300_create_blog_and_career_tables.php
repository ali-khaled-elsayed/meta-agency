<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('blog_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name')->nullable();
            $table->json('title');
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->string('cover_image')->nullable();
            $table->unsignedSmallInteger('reading_minutes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->boolean('is_featured')->default(false);
            $table->json('seo')->nullable();
            $table->timestamps();
        });

        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');
            $table->json('department')->nullable();
            $table->json('location')->nullable();
            $table->string('employment_type')->default('full_time');
            $table->string('workplace_type')->default('on_site');
            $table->json('summary')->nullable();
            $table->json('responsibilities')->nullable();
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->date('closes_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->json('seo')->nullable();
            $table->timestamps();
        });

        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->nullable()->constrained()->nullOnDelete();
            $table->string('position')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('cv_path');
            $table->string('cv_original_name');
            $table->string('portfolio_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('expected_salary')->nullable();
            $table->date('available_from')->nullable();
            $table->string('english_level')->nullable();
            $table->string('source')->nullable();
            $table->text('message')->nullable();
            $table->boolean('consent')->default(false);
            $table->string('status')->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('service')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->string('status')->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['contact_messages', 'job_applications', 'job_postings', 'blog_posts', 'blog_categories'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
