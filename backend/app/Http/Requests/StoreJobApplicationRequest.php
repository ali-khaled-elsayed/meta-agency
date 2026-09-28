<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use App\Models\JobPosting;
use App\Rules\MatchesFileSignature;
use App\Services\SiteSettingsService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobApplicationRequest extends FormRequest
{
    use SanitizesInput;

    public const CV_MAX_KB = 5120;

    public const CV_EXTENSIONS = ['pdf', 'doc', 'docx'];

    public const CV_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $fields = app(SiteSettingsService::class)->jobFormFields();
        $optional = fn (string $field, array $rules) => $fields[$field] === 'hidden'
            ? ['prohibited']
            : [$fields[$field] === 'required' ? 'required' : 'nullable', ...$rules];

        return [
            'job_slug' => ['nullable', 'string', Rule::exists(JobPosting::class, 'slug')->where('is_active', true)],
            'position' => ['required_without:job_slug', 'nullable', 'string', 'max:150'],
            'first_name' => ['required', 'string', 'min:2', 'max:80'],
            'last_name' => ['required', 'string', 'min:2', 'max:80'],
            'email' => $this->emailRules(),
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+()\-\s]{6,30}$/'],
            'cv' => [
                'required',
                'file',
                'extensions:'.implode(',', self::CV_EXTENSIONS),
                'mimes:'.implode(',', self::CV_EXTENSIONS),
                'mimetypes:'.implode(',', self::CV_MIME_TYPES),
                'max:'.self::CV_MAX_KB,
                new MatchesFileSignature,
            ],
            'city' => $optional('city', ['string', 'max:100']),
            'country' => $optional('country', ['string', 'max:100']),
            'portfolio_url' => $optional('portfolio_url', ['url:https,http', 'max:255']),
            'linkedin_url' => $optional('linkedin_url', ['url:https', 'max:255', 'regex:/linkedin\.com/i']),
            'expected_salary' => $optional('expected_salary', ['string', 'max:60']),
            'available_from' => $optional('available_from', ['date', 'after_or_equal:today']),
            'english_level' => $optional('english_level', ['string', 'max:60']),
            'source' => $optional('source', ['string', 'max:100']),
            'message' => $optional('message', ['string', 'max:5000']),
            'consent' => ['accepted'],
            'website' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'cv.extensions' => 'The CV must be a PDF, DOC or DOCX file.',
            'cv.mimes' => 'The CV must be a PDF, DOC or DOCX file.',
            'cv.mimetypes' => 'The CV file type is not allowed.',
            'cv.max' => 'The CV may not be larger than 5 MB.',
            'linkedin_url.regex' => 'Please enter a LinkedIn profile URL.',
            'consent.accepted' => 'Please accept the data processing consent.',
        ];
    }
}
