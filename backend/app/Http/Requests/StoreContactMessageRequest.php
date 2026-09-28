<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    use SanitizesInput;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => $this->emailRules(),
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+()\-\s]{6,30}$/'],
            'company' => ['nullable', 'string', 'max:150'],
            'service' => ['nullable', 'string', 'max:150'],
            'budget' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            // Honeypot: real users never see or fill this field.
            'website' => ['prohibited'],
        ];
    }
}
