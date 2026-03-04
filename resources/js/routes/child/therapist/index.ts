import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
export const features = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(args, options),
    method: 'get',
})

features.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
features.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { therapist: args }
    }

    if (Array.isArray(args)) {
        args = {
            therapist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        therapist: args.therapist,
    }

    return features.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
features.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
features.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: features.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
const featuresForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
featuresForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::features
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
featuresForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

features.form = featuresForm

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
export const message = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: message.url(args, options),
    method: 'get',
})

message.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/message',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
message.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { therapist: args }
    }

    if (Array.isArray(args)) {
        args = {
            therapist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        therapist: args.therapist,
    }

    return message.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
message.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: message.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
message.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: message.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
const messageForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: message.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
messageForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: message.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::message
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
messageForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: message.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

message.form = messageForm

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
export const appointment = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appointment.url(args, options),
    method: 'get',
})

appointment.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/appointment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
appointment.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { therapist: args }
    }

    if (Array.isArray(args)) {
        args = {
            therapist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        therapist: args.therapist,
    }

    return appointment.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
appointment.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
appointment.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appointment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
const appointmentForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
appointmentForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::appointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
appointmentForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appointment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

appointment.form = appointmentForm

const therapist = {
    features: Object.assign(features, features),
    message: Object.assign(message, message),
    appointment: Object.assign(appointment, appointment),
}

export default therapist