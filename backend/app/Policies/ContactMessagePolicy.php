<?php

namespace App\Policies;

use App\Policies\Concerns\AdminOnlyInbox;

class ContactMessagePolicy
{
    use AdminOnlyInbox;
}
