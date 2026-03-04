import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import availability135fa0 from './availability'
import availabilitySlots from './availability-slots'
import consultation from './consultation'
import appointments from './appointments'
import connectionsA7791f from './connections'
import requests from './requests'
import client from './client'
import child from './child'
/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
export const availability = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availability.url(options),
    method: 'get',
})

availability.definition = {
    methods: ["get","head"],
    url: '/therapist/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
availability.url = (options?: RouteQueryOptions) => {
    return availability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
availability.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availability.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
availability.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availability.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
const availabilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availability.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
availabilityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availability.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::availability
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
availabilityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availability.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availability.form = availabilityForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
export const connections = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connections.url(options),
    method: 'get',
})

connections.definition = {
    methods: ["get","head"],
    url: '/therapist/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
connections.url = (options?: RouteQueryOptions) => {
    return connections.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
connections.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connections.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
connections.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: connections.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
const connectionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connections.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
connectionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connections.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::connections
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
connectionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connections.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

connections.form = connectionsForm

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
export const clients = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clients.url(options),
    method: 'get',
})

clients.definition = {
    methods: ["get","head"],
    url: '/clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.url = (options?: RouteQueryOptions) => {
    return clients.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clients.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
const clientsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clientsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clientsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

clients.form = clientsForm

const therapist = {
    availability: Object.assign(availability, availability135fa0),
    availabilitySlots: Object.assign(availabilitySlots, availabilitySlots),
    consultation: Object.assign(consultation, consultation),
    appointments: Object.assign(appointments, appointments),
    connections: Object.assign(connections, connectionsA7791f),
    requests: Object.assign(requests, requests),
    clients: Object.assign(clients, clients),
    client: Object.assign(client, client),
    child: Object.assign(child, child),
}

export default therapist