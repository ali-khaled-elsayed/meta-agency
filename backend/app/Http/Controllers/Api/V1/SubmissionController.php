<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Services\ContactMessageService;
use App\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;

class SubmissionController extends Controller
{
    public function contact(StoreContactMessageRequest $request, ContactMessageService $service): JsonResponse
    {
        $message = $service->submit($request->validated(), $request);

        return response()->json([
            'data' => ['id' => $message->id],
            'message' => 'Thank you — your message has been received.',
        ], 201);
    }

    public function jobApplication(StoreJobApplicationRequest $request, JobApplicationService $service): JsonResponse
    {
        $application = $service->submit($request->safe()->except('cv'), $request->file('cv'), $request);

        return response()->json([
            'data' => ['id' => $application->id],
            'message' => 'Thank you — your application has been received.',
        ], 201);
    }
}
