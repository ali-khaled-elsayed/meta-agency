<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/**
 * Verifies an upload's leading bytes match the signature expected for its
 * extension, independent of client-supplied or guessed MIME types.
 */
class MatchesFileSignature implements ValidationRule
{
    public const SIGNATURES = [
        'pdf' => ['%PDF-'],
        'doc' => ["\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1"],
        'docx' => ["PK\x03\x04"],
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile || ! $value->isValid()) {
            return;
        }

        $signatures = self::SIGNATURES[strtolower($value->getClientOriginalExtension())] ?? null;
        $handle = $signatures ? @fopen($value->getRealPath(), 'rb') : false;

        if (! $handle) {
            $fail('The :attribute file type is not allowed.');

            return;
        }

        $head = (string) fread($handle, 8);
        fclose($handle);

        foreach ($signatures as $signature) {
            if (str_starts_with($head, $signature)) {
                return;
            }
        }

        $fail('The :attribute file content does not match its type.');
    }
}
