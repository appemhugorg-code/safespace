import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
const communicationFeaturese33583fef92048c108c4bd29e00c5714 = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, options),
    method: 'get',
})

communicationFeaturese33583fef92048c108c4bd29e00c5714.definition = {
    methods: ["get","head"],
    url: '/api/child/therapist/{therapist}/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
communicationFeaturese33583fef92048c108c4bd29e00c5714.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return communicationFeaturese33583fef92048c108c4bd29e00c5714.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
communicationFeaturese33583fef92048c108c4bd29e00c5714.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
communicationFeaturese33583fef92048c108c4bd29e00c5714.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
const communicationFeaturese33583fef92048c108c4bd29e00c5714Form = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
communicationFeaturese33583fef92048c108c4bd29e00c5714Form.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/api/child/therapist/{therapist}/features'
*/
communicationFeaturese33583fef92048c108c4bd29e00c5714Form.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturese33583fef92048c108c4bd29e00c5714.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

communicationFeaturese33583fef92048c108c4bd29e00c5714.form = communicationFeaturese33583fef92048c108c4bd29e00c5714Form
/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
const communicationFeaturesaa37aabf77598054a3e1036e5bc528d4 = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, options),
    method: 'get',
})

communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
const communicationFeaturesaa37aabf77598054a3e1036e5bc528d4Form = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
communicationFeaturesaa37aabf77598054a3e1036e5bc528d4Form.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::communicationFeatures
* @see app/Http/Controllers/Child/ChildConnectionController.php:134
* @route '/child/therapist/{therapist}/features'
*/
communicationFeaturesaa37aabf77598054a3e1036e5bc528d4Form.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

communicationFeaturesaa37aabf77598054a3e1036e5bc528d4.form = communicationFeaturesaa37aabf77598054a3e1036e5bc528d4Form

export const communicationFeatures = {
    '/api/child/therapist/{therapist}/features': communicationFeaturese33583fef92048c108c4bd29e00c5714,
    '/child/therapist/{therapist}/features': communicationFeaturesaa37aabf77598054a3e1036e5bc528d4,
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/child/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
export const show = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/child/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.url = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connection: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { connection: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            connection: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        connection: typeof args.connection === 'object'
        ? args.connection.id
        : args.connection,
    }

    return show.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.get = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.head = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
const showForm = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
showForm.get = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
showForm.head = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
export const startConversation = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: startConversation.url(args, options),
    method: 'get',
})

startConversation.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/message',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
startConversation.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return startConversation.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
startConversation.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: startConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
startConversation.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: startConversation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
const startConversationForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: startConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
startConversationForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: startConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::startConversation
* @see app/Http/Controllers/Child/ChildConnectionController.php:205
* @route '/child/therapist/{therapist}/message'
*/
startConversationForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: startConversation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

startConversation.form = startConversationForm

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
export const createAppointment = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createAppointment.url(args, options),
    method: 'get',
})

createAppointment.definition = {
    methods: ["get","head"],
    url: '/child/therapist/{therapist}/appointment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
createAppointment.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return createAppointment.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
createAppointment.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createAppointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
createAppointment.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createAppointment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
const createAppointmentForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createAppointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
createAppointmentForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createAppointment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::createAppointment
* @see app/Http/Controllers/Child/ChildConnectionController.php:224
* @route '/child/therapist/{therapist}/appointment'
*/
createAppointmentForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createAppointment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createAppointment.form = createAppointmentForm

const ChildConnectionController = { communicationFeatures, index, show, startConversation, createAppointment }

export default ChildConnectionController