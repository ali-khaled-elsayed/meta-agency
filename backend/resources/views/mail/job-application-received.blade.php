<x-mail::message>
# New job application

**Position:** {{ $application->position ?: 'General application' }}
**Name:** {{ $application->full_name }}
**Email:** {{ $application->email }}
**Phone:** {{ $application->phone }}
@if($application->linkedin_url)
**LinkedIn:** {{ $application->linkedin_url }}
@endif
@if($application->portfolio_url)
**Portfolio:** {{ $application->portfolio_url }}
@endif

The CV is stored securely and can be downloaded from the admin panel.

<x-mail::button :url="url('/admin/job-applications/'.$application->id)">
Review application
</x-mail::button>
</x-mail::message>
