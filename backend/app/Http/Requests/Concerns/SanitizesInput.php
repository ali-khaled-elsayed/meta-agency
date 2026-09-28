<?php

namespace App\Http\Requests\Concerns;

trait SanitizesInput
{
    /**
     * Rules for a safe single-line email address. `not_regex` blocks CR/LF header injection
     * independently of the framework's `email` rule.
     *
     * @return array<int, string>
     */
    protected function emailRules(): array
    {
        return ['required', 'string', 'max:190', 'email:rfc,strict', 'not_regex:/[\r\n]/'];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(collect($this->except($this->allFiles() ? array_keys($this->allFiles()) : []))
            ->map(fn ($value) => is_string($value) ? trim(strip_tags($value)) : $value)
            ->all());
    }
}
