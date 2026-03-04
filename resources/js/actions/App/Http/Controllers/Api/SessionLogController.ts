import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/session-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::index
* @see app/Http/Controllers/Api/SessionLogController.php:362
* @route '/api/session-logs'
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
* @see \App\Http\Controllers\Api\SessionLogController::start
* @see app/Http/Controllers/Api/SessionLogController.php:24
* @route '/api/session-logs/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/api/session-logs/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::start
* @see app/Http/Controllers/Api/SessionLogController.php:24
* @route '/api/session-logs/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::start
* @see app/Http/Controllers/Api/SessionLogController.php:24
* @route '/api/session-logs/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::start
* @see app/Http/Controllers/Api/SessionLogController.php:24
* @route '/api/session-logs/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::start
* @see app/Http/Controllers/Api/SessionLogController.php:24
* @route '/api/session-logs/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::end
* @see app/Http/Controllers/Api/SessionLogController.php:69
* @route '/api/session-logs/{sessionId}/end'
*/
export const end = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(args, options),
    method: 'post',
})

end.definition = {
    methods: ["post"],
    url: '/api/session-logs/{sessionId}/end',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::end
* @see app/Http/Controllers/Api/SessionLogController.php:69
* @route '/api/session-logs/{sessionId}/end'
*/
end.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return end.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::end
* @see app/Http/Controllers/Api/SessionLogController.php:69
* @route '/api/session-logs/{sessionId}/end'
*/
end.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::end
* @see app/Http/Controllers/Api/SessionLogController.php:69
* @route '/api/session-logs/{sessionId}/end'
*/
const endForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: end.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::end
* @see app/Http/Controllers/Api/SessionLogController.php:69
* @route '/api/session-logs/{sessionId}/end'
*/
endForm.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: end.url(args, options),
    method: 'post',
})

end.form = endForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
export const show = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/session-logs/{sessionId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
show.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return show.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
show.get = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
show.head = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
const showForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
showForm.get = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::show
* @see app/Http/Controllers/Api/SessionLogController.php:328
* @route '/api/session-logs/{sessionId}'
*/
showForm.head = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\SessionLogController::addParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:106
* @route '/api/session-logs/{sessionId}/participants'
*/
export const addParticipant = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addParticipant.url(args, options),
    method: 'post',
})

addParticipant.definition = {
    methods: ["post"],
    url: '/api/session-logs/{sessionId}/participants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::addParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:106
* @route '/api/session-logs/{sessionId}/participants'
*/
addParticipant.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return addParticipant.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::addParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:106
* @route '/api/session-logs/{sessionId}/participants'
*/
addParticipant.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::addParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:106
* @route '/api/session-logs/{sessionId}/participants'
*/
const addParticipantForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::addParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:106
* @route '/api/session-logs/{sessionId}/participants'
*/
addParticipantForm.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addParticipant.url(args, options),
    method: 'post',
})

addParticipant.form = addParticipantForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::removeParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:144
* @route '/api/session-logs/{sessionId}/participants/{participantId}'
*/
export const removeParticipant = (args: { sessionId: string | number, participantId: string | number } | [sessionId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeParticipant.url(args, options),
    method: 'delete',
})

removeParticipant.definition = {
    methods: ["delete"],
    url: '/api/session-logs/{sessionId}/participants/{participantId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::removeParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:144
* @route '/api/session-logs/{sessionId}/participants/{participantId}'
*/
removeParticipant.url = (args: { sessionId: string | number, participantId: string | number } | [sessionId: string | number, participantId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
            participantId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
        participantId: args.participantId,
    }

    return removeParticipant.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::removeParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:144
* @route '/api/session-logs/{sessionId}/participants/{participantId}'
*/
removeParticipant.delete = (args: { sessionId: string | number, participantId: string | number } | [sessionId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeParticipant.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::removeParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:144
* @route '/api/session-logs/{sessionId}/participants/{participantId}'
*/
const removeParticipantForm = (args: { sessionId: string | number, participantId: string | number } | [sessionId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::removeParticipant
* @see app/Http/Controllers/Api/SessionLogController.php:144
* @route '/api/session-logs/{sessionId}/participants/{participantId}'
*/
removeParticipantForm.delete = (args: { sessionId: string | number, participantId: string | number } | [sessionId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeParticipant.form = removeParticipantForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::addNote
* @see app/Http/Controllers/Api/SessionLogController.php:168
* @route '/api/session-logs/{sessionId}/notes'
*/
export const addNote = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addNote.url(args, options),
    method: 'post',
})

addNote.definition = {
    methods: ["post"],
    url: '/api/session-logs/{sessionId}/notes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::addNote
* @see app/Http/Controllers/Api/SessionLogController.php:168
* @route '/api/session-logs/{sessionId}/notes'
*/
addNote.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return addNote.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::addNote
* @see app/Http/Controllers/Api/SessionLogController.php:168
* @route '/api/session-logs/{sessionId}/notes'
*/
addNote.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addNote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::addNote
* @see app/Http/Controllers/Api/SessionLogController.php:168
* @route '/api/session-logs/{sessionId}/notes'
*/
const addNoteForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addNote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::addNote
* @see app/Http/Controllers/Api/SessionLogController.php:168
* @route '/api/session-logs/{sessionId}/notes'
*/
addNoteForm.post = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addNote.url(args, options),
    method: 'post',
})

addNote.form = addNoteForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
export const getNotes = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNotes.url(args, options),
    method: 'get',
})

getNotes.definition = {
    methods: ["get","head"],
    url: '/api/session-logs/{sessionId}/notes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
getNotes.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return getNotes.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
getNotes.get = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNotes.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
getNotes.head = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getNotes.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
const getNotesForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNotes.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
getNotesForm.get = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNotes.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::getNotes
* @see app/Http/Controllers/Api/SessionLogController.php:208
* @route '/api/session-logs/{sessionId}/notes'
*/
getNotesForm.head = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNotes.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getNotes.form = getNotesForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateGoals
* @see app/Http/Controllers/Api/SessionLogController.php:246
* @route '/api/session-logs/{sessionId}/goals'
*/
export const updateGoals = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGoals.url(args, options),
    method: 'put',
})

updateGoals.definition = {
    methods: ["put"],
    url: '/api/session-logs/{sessionId}/goals',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateGoals
* @see app/Http/Controllers/Api/SessionLogController.php:246
* @route '/api/session-logs/{sessionId}/goals'
*/
updateGoals.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return updateGoals.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateGoals
* @see app/Http/Controllers/Api/SessionLogController.php:246
* @route '/api/session-logs/{sessionId}/goals'
*/
updateGoals.put = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGoals.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateGoals
* @see app/Http/Controllers/Api/SessionLogController.php:246
* @route '/api/session-logs/{sessionId}/goals'
*/
const updateGoalsForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGoals.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateGoals
* @see app/Http/Controllers/Api/SessionLogController.php:246
* @route '/api/session-logs/{sessionId}/goals'
*/
updateGoalsForm.put = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGoals.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateGoals.form = updateGoalsForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateOutcomes
* @see app/Http/Controllers/Api/SessionLogController.php:287
* @route '/api/session-logs/{sessionId}/outcomes'
*/
export const updateOutcomes = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOutcomes.url(args, options),
    method: 'put',
})

updateOutcomes.definition = {
    methods: ["put"],
    url: '/api/session-logs/{sessionId}/outcomes',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateOutcomes
* @see app/Http/Controllers/Api/SessionLogController.php:287
* @route '/api/session-logs/{sessionId}/outcomes'
*/
updateOutcomes.url = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            sessionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sessionId: args.sessionId,
    }

    return updateOutcomes.definition.url
            .replace('{sessionId}', parsedArgs.sessionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateOutcomes
* @see app/Http/Controllers/Api/SessionLogController.php:287
* @route '/api/session-logs/{sessionId}/outcomes'
*/
updateOutcomes.put = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOutcomes.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateOutcomes
* @see app/Http/Controllers/Api/SessionLogController.php:287
* @route '/api/session-logs/{sessionId}/outcomes'
*/
const updateOutcomesForm = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateOutcomes.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::updateOutcomes
* @see app/Http/Controllers/Api/SessionLogController.php:287
* @route '/api/session-logs/{sessionId}/outcomes'
*/
updateOutcomesForm.put = (args: { sessionId: string | number } | [sessionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateOutcomes.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateOutcomes.form = updateOutcomesForm

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/session-logs/statistics/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
*/
statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SessionLogController::statistics
* @see app/Http/Controllers/Api/SessionLogController.php:402
* @route '/api/session-logs/statistics/overview'
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

const SessionLogController = { index, start, end, show, addParticipant, removeParticipant, addNote, getNotes, updateGoals, updateOutcomes, statistics }

export default SessionLogController