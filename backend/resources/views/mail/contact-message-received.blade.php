<x-mail::message>
# New contact message

**Name:** {{ $contactMessage->name }}
**Email:** {{ $contactMessage->email }}
@if($contactMessage->phone)
**Phone:** {{ $contactMessage->phone }}
@endif
@if($contactMessage->company)
**Company:** {{ $contactMessage->company }}
@endif
@if($contactMessage->service)
**Service:** {{ $contactMessage->service }}
@endif
@if($contactMessage->budget)
**Budget:** {{ $contactMessage->budget }}
@endif

<x-mail::panel>
{{ $contactMessage->message }}
</x-mail::panel>

<x-mail::button :url="url('/admin/contact-messages/'.$contactMessage->id)">
Open in admin
</x-mail::button>
</x-mail::message>
