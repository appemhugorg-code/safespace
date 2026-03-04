import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/session-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::index
* @see app/Http/Controllers/Api/SessionRecordingController.php:230
* @route '/api/session-recordings'
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
* @see \App\Http\Controllers\Api\SessionRecordingController::start
* @see app/Http/Controllers/Api/SessionRecordingController.php:24
* @route '/api/session-recordings/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/api/session-recordings/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::start
* @see app/Http/Controllers/Api/SessionRecordingController.php:24
* @route '/api/session-recordings/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::start
* @see app/Http/Controllers/Api/SessionRecordingController.php:24
* @route '/api/session-recordings/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::start
* @see app/Http/Controllers/Api/SessionRecordingController.php:24
* @route '/api/session-recordings/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::start
* @see app/Http/Controllers/Api/SessionRecordingController.php:24
* @route '/api/session-recordings/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::stop
* @see app/Http/Controllers/Api/SessionRecordingController.php:64
* @route '/api/session-recordings/{recordingId}/stop'
*/
export const stop = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/api/session-recordings/{recordingId}/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::stop
* @see app/Http/Controllers/Api/SessionRecordingController.php:64
* @route '/api/session-recordings/{recordingId}/stop'
*/
stop.url = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordingId: args }
    }

    if (Array.isArray(args)) {
        args = {
            recordingId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recordingId: args.recordingId,
    }

    return stop.definition.url
            .replace('{recordingId}', parsedArgs.recordingId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::stop
* @see app/Http/Controllers/Api/SessionRecordingController.php:64
* @route '/api/session-recordings/{recordingId}/stop'
*/
stop.post = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::stop
* @see app/Http/Controllers/Api/SessionRecordingController.php:64
* @route '/api/session-recordings/{recordingId}/stop'
*/
const stopForm = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::stop
* @see app/Http/Controllers/Api/SessionRecordingController.php:64
* @route '/api/session-recordings/{recordingId}/stop'
*/
stopForm.post = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(args, options),
    method: 'post',
})

stop.form = stopForm

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
export const show = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/session-recordings/{recordingId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
show.url = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordingId: args }
    }

    if (Array.isArray(args)) {
        args = {
            recordingId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recordingId: args.recordingId,
    }

    return show.definition.url
            .replace('{recordingId}', parsedArgs.recordingId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
show.get = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
show.head = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
const showForm = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
showForm.get = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::show
* @see app/Http/Controllers/Api/SessionRecordingController.php:105
* @route '/api/session-recordings/{recordingId}'
*/
showForm.head = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
export const download = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/session-recordings/{recordingId}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
download.url = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordingId: args }
    }

    if (Array.isArray(args)) {
        args = {
            recordingId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recordingId: args.recordingId,
    }

    return download.definition.url
            .replace('{recordingId}', parsedArgs.recordingId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
download.get = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
download.head = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
const downloadForm = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
downloadForm.get = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::download
* @see app/Http/Controllers/Api/SessionRecordingController.php:138
* @route '/api/session-recordings/{recordingId}/download'
*/
downloadForm.head = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::updateAccess
* @see app/Http/Controllers/Api/SessionRecordingController.php:165
* @route '/api/session-recordings/{recordingId}/access'
*/
export const updateAccess = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAccess.url(args, options),
    method: 'put',
})

updateAccess.definition = {
    methods: ["put"],
    url: '/api/session-recordings/{recordingId}/access',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::updateAccess
* @see app/Http/Controllers/Api/SessionRecordingController.php:165
* @route '/api/session-recordings/{recordingId}/access'
*/
updateAccess.url = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordingId: args }
    }

    if (Array.isArray(args)) {
        args = {
            recordingId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recordingId: args.recordingId,
    }

    return updateAccess.definition.url
            .replace('{recordingId}', parsedArgs.recordingId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::updateAccess
* @see app/Http/Controllers/Api/SessionRecordingController.php:165
* @route '/api/session-recordings/{recordingId}/access'
*/
updateAccess.put = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAccess.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::updateAccess
* @see app/Http/Controllers/Api/SessionRecordingController.php:165
* @route '/api/session-recordings/{recordingId}/access'
*/
const updateAccessForm = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateAccess.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::updateAccess
* @see app/Http/Controllers/Api/SessionRecordingController.php:165
* @route '/api/session-recordings/{recordingId}/access'
*/
updateAccessForm.put = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateAccess.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateAccess.form = updateAccessForm

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::destroy
* @see app/Http/Controllers/Api/SessionRecordingController.php:209
* @route '/api/session-recordings/{recordingId}'
*/
export const destroy = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/session-recordings/{recordingId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::destroy
* @see app/Http/Controllers/Api/SessionRecordingController.php:209
* @route '/api/session-recordings/{recordingId}'
*/
destroy.url = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordingId: args }
    }

    if (Array.isArray(args)) {
        args = {
            recordingId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recordingId: args.recordingId,
    }

    return destroy.definition.url
            .replace('{recordingId}', parsedArgs.recordingId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::destroy
* @see app/Http/Controllers/Api/SessionRecordingController.php:209
* @route '/api/session-recordings/{recordingId}'
*/
destroy.delete = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::destroy
* @see app/Http/Controllers/Api/SessionRecordingController.php:209
* @route '/api/session-recordings/{recordingId}'
*/
const destroyForm = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::destroy
* @see app/Http/Controllers/Api/SessionRecordingController.php:209
* @route '/api/session-recordings/{recordingId}'
*/
destroyForm.delete = (args: { recordingId: string | number } | [recordingId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/session-recordings/statistics/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionRecordingController::statistics
* @see app/Http/Controllers/Api/SessionRecordingController.php:270
* @route '/api/session-recordings/statistics/overview'
*/
statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statistics.form = statisticsForm

const SessionRecordingController = { index, start, stop, show, download, updateAccess, destroy, statistics }

export default SessionRecordingController