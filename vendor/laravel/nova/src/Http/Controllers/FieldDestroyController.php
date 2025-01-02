<?php

namespace Laravel\Nova\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Laravel\Nova\Contracts\Downloadable;
use Laravel\Nova\DeleteField;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Nova;

class FieldDestroyController extends Controller
{
    /**
     * Delete the file at the given field.
     */
    public function __invoke(NovaRequest $request): Response
    {
        $resource = $request->findResourceOrFail();

        $resource->authorizeToUpdate($request);

        $field = $resource->updateFields($request)
                    ->whereInstanceOf(Downloadable::class)
                    ->findFieldByAttributeOrFail($request->field);

        DeleteField::forRequest(
            $request, $field, $resource->resource
        )->save();

        Nova::usingActionEvent(function ($actionEvent) use ($request, $resource) {
            $actionEvent->forResourceUpdate(
                Nova::user($request), $resource->resource
            )->save();
        });

        return response()->noContent(200);
    }
}