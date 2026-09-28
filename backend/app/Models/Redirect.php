<?php

namespace App\Models;

use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    use RevalidatesFrontend;

    protected $fillable = ['from_path', 'to_path', 'status_code', 'is_active'];

    protected function casts(): array
    {
        return ['status_code' => 'integer', 'is_active' => 'boolean'];
    }

    protected function fromPath(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => '/'.trim(parse_url($value, PHP_URL_PATH) ?: $value, '/'),
        );
    }
}
