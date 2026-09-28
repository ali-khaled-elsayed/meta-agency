<?php

namespace App\Filament\Admin\Pages;

use App\Filament\Support\Fields;
use App\Models\SiteSetting;
use App\Services\SiteSettingsService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class ManageSiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Site settings';

    protected static ?string $title = 'Site settings';

    protected static ?string $slug = 'site-settings';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $values = SiteSetting::allValues();
        $keys = [...SiteSettingsService::TRANSLATABLE_KEYS, ...SiteSettingsService::PLAIN_KEYS, ...SiteSettingsService::PRIVATE_KEYS];

        $this->form->fill(collect($keys)->mapWithKeys(fn (string $key) => [$key => $values[$key] ?? null])->all());
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data')->components([
            Tabs::make('Settings')->columnSpanFull()->persistTabInQueryString()->tabs([
                Tab::make('Brand')->icon(Heroicon::OutlinedSparkles)->schema([
                    Fields::localeTabs(fn (string $locale, bool $default) => [
                        Fields::text('site_name', $locale, $default),
                        Fields::text('tagline', $locale),
                        Fields::textarea('description', $locale, rows: 3)->label('Default meta description')->maxLength(170),
                        Fields::textarea('mission', $locale, rows: 2),
                        Fields::textarea('vision', $locale, rows: 2),
                        Fields::text('footer_cta', $locale)->label('Footer call to action'),
                    ]),
                    Grid::make(3)->schema([
                        Fields::image('logo', 'brand', 'Logo (for light backgrounds)')->imageEditor(false),
                        Fields::image('logo_light', 'brand', 'Logo (for dark backgrounds)')->imageEditor(false),
                        Fields::image('logo_icon', 'brand', 'Icon / favicon source')->imageEditor(false),
                    ]),
                    Fields::image('default_og_image', 'brand', 'Default social sharing image (1200×630)'),
                    Fields::video('hero_video', 'brand/videos', 'Hero video (upload)'),
                    Fields::videoUrl('hero_video_url')->label('…or hero video URL'),
                ]),
                Tab::make('Contact')->icon(Heroicon::OutlinedPhone)->schema([
                    Grid::make(2)->schema([
                        TextInput::make('contact_email')->email()->required()->maxLength(190),
                        TextInput::make('contact_phone')->tel()->maxLength(30),
                        TextInput::make('whatsapp_number')->tel()->maxLength(30)->helperText('International format, e.g. +2010…'),
                        TextInput::make('google_maps_url')->url()->maxLength(500),
                    ]),
                    Fields::localeTabs(fn (string $locale) => [Fields::text('working_hours', $locale)]),
                    TagsInput::make('notification_emails')
                        ->label('Send form notifications to')
                        ->placeholder('Add email and press Enter')
                        ->nestedRecursiveRules(['email', 'max:190'])
                        ->helperText('Contact messages and job applications are emailed here (and to the contact email). Never shown on the website.'),
                ]),
                Tab::make('Forms')->icon(Heroicon::OutlinedClipboardDocumentList)->schema([
                    Fields::localeTabs(fn (string $locale) => [
                        TagsInput::make("contact_service_options.$locale")->label('Contact form: "What can we help you with?" options'),
                        TagsInput::make("budget_options.$locale")->label('Contact form: budget options (leave empty to hide the field)'),
                        TagsInput::make("job_source_options.$locale")->label('Job form: "Where did you hear about us?" options'),
                        TagsInput::make("english_levels.$locale")->label('Job form: English level options'),
                    ], 'Options'),
                    Section::make('Job application fields')
                        ->description('Name, email, phone, CV and consent are always required.')
                        ->columns(3)
                        ->schema(collect(SiteSettingsService::JOB_FORM_FIELDS)->map(
                            fn (string $field) => Select::make("job_form_fields.$field")
                                ->label(Str::headline($field))
                                ->options(['required' => 'Required', 'optional' => 'Optional', 'hidden' => 'Hidden'])
                                ->default('optional')
                                ->selectablePlaceholder(false)
                        )->all()),
                ]),
            ]),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([
                    Actions::make([
                        Action::make('save')->label('Save settings')->submit('save')->keyBindings(['mod+s']),
                    ]),
                ]),
        ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        DB::transaction(fn () => SiteSetting::putMany($data));

        Notification::make()->success()->title('Settings saved')->send();
    }
}
