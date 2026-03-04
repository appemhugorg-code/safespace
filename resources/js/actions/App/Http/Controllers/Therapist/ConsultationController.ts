import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/therapist/consultation/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\ConsultationController::create
* @see app/Http/Controllers/Therapist/ConsultationController.php:15
* @route '/therapist/consultation/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

const ConsultationController = { create }

export default ConsultationController