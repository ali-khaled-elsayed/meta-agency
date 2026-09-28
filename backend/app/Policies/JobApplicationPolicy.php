<?php

namespace App\Policies;

use App\Policies\Concerns\AdminOnlyInbox;

class JobApplicationPolicy
{
    use AdminOnlyInbox;
}
