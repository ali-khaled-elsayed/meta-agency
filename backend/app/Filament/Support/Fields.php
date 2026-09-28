<?php

namespace App\Filament\Support;

use App\Support\Media;
use Closure;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Support\Str;

class Fields
{
    public const LOCALES = ['en' => 'English', 'ar' => 'العربية'];

    public const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    /**
     * One tab per locale. The factory receives the locale and whether it is the default (required) locale,
     * and returns the fields for that tab, named e.g. "title.$locale".
     */
    public static function localeTabs(Closure $fields, string $label = 'Content'): Tabs
    {
        return Tabs::make($label)
            ->tabs(collect(self::LOCALES)->map(
                fn (string $name, string $locale) => Tab::make($name)
                    ->schema($fields($locale, $locale === config('app.fallback_locale', 'en')))
            )->values()->all())
            ->columnSpanFull();
    }

    public static function text(string $name, string $locale, bool $required = false): TextInput
    {
        return self::localize(TextInput::make("$name.$locale")->required($required)->maxLength(255), $locale);
    }

    public static function textarea(string $name, string $locale, bool $required = false, int $rows = 4): Textarea
    {
        return self::localize(Textarea::make("$name.$locale")->required($required)->rows($rows)->maxLength(5000), $locale);
    }

    public static function richText(string $name, string $locale): RichEditor
    {
        return self::localize(
            RichEditor::make("$name.$locale")
                ->fileAttachmentsDisk(Media::DISK)
                ->fileAttachmentsDirectory('editor')
                ->fileAttachmentsVisibility('public')
                ->toolbarButtons([
                    ['bold', 'italic', 'underline', 'strike', 'link'],
                    ['h2', 'h3', 'blockquote', 'bulletList', 'orderedList'],
                    ['attachFiles', 'undo', 'redo'],
                ]),
            $locale,
        );
    }

    /**
     * Title field for the default locale that fills the slug while creating a record.
     */
    public static function titleWithSlug(string $locale, bool $required, string $name = 'title'): TextInput
    {
        $field = self::text($name, $locale, $required);

        return $required
            ? $field->live(onBlur: true)->afterStateUpdated(function (Set $set, ?string $state, string $operation) {
                if ($operation === 'create' && filled($state)) {
                    $set('slug', Str::slug($state));
                }
            })
            : $field;
    }

    public static function slug(string $table): TextInput
    {
        return TextInput::make('slug')
            ->required()
            ->maxLength(150)
            ->alphaDash()
            ->unique($table, 'slug', ignoreRecord: true)
            ->helperText('Used in the URL. Lowercase letters, numbers and dashes.');
    }

    public static function image(string $name, string $directory, string $label = null): FileUpload
    {
        return FileUpload::make($name)
            ->label($label ?? Str::headline($name))
            ->image()
            ->disk(Media::DISK)
            ->directory($directory)
            ->visibility('public')
            ->acceptedFileTypes(self::IMAGE_TYPES)
            ->maxSize(5120)
            ->imageEditor()
            ->helperText('JPG, PNG, WebP or AVIF, up to 5 MB. Images are resized and served as WebP/AVIF automatically.');
    }

    public static function gallery(string $directory): FileUpload
    {
        return self::image('gallery', $directory, 'Gallery')
            ->multiple()
            ->reorderable()
            ->maxFiles(24)
            ->panelLayout('grid');
    }

    public static function videoUrl(string $name = 'video_url'): TextInput
    {
        return TextInput::make($name)
            ->label('Video URL')
            ->url()
            ->maxLength(500)
            ->helperText('Direct link to an MP4/WebM file (kept short and compressed) or a YouTube/Vimeo URL.');
    }

    public static function seo(string $directory = 'seo'): Section
    {
        return Section::make('SEO')
            ->description('Leave empty to use the page title and excerpt.')
            ->collapsed()
            ->schema([
                self::localeTabs(fn (string $locale) => [
                    self::text('seo.title', $locale)->label('Meta title')->maxLength(70),
                    self::textarea('seo.description', $locale, rows: 2)->label('Meta description')->maxLength(170),
                ], 'SEO'),
                self::image('seo.image', $directory, 'Social sharing image (1200×630)'),
                Toggle::make('seo.noindex')->label('Hide from search engines'),
            ])
            ->columnSpanFull();
    }

    public static function publishing(): Section
    {
        return Section::make('Visibility')
            ->schema([
                Toggle::make('is_active')->label('Published')->default(true),
                TextInput::make('sort_order')->numeric()->default(0)->minValue(0),
            ]);
    }

    /**
     * @template T of \Filament\Forms\Components\Field
     *
     * @param  T  $field
     * @return T
     */
    private static function localize($field, string $locale)
    {
        $base = Str::of($field->getName())->beforeLast('.')->afterLast('.')->headline()->toString();
        $field->label($base);

        if ($locale === 'ar') {
            $field->extraInputAttributes(['dir' => 'rtl']);
        }

        return $field;
    }
}
