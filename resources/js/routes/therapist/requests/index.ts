import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approve
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
export const approve = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/therapist/requests/{request}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approve
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approve.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return approve.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approve
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approve.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approve
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
const approveForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approve
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approveForm.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::decline
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
export const decline = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/therapist/requests/{request}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::decline
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
decline.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return decline.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::decline
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
decline.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::decline
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
const declineForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::decline
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
declineForm.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

decline.form = declineForm

const requests = {
    approve: Object.assign(approve, approve),
    decline: Object.assign(decline, decline),
}

export default requests