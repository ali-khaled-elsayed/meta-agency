<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'logo' => 'clients/'.$this->faker->uuid().'.png',
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 50),
        ];
    }
}
