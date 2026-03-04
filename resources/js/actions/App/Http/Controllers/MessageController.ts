import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/api/messages'
*/
const storebf9a5229c3a043b734128d86a1b15635 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storebf9a5229c3a043b734128d86a1b15635.url(options),
    method: 'post',
})

storebf9a5229c3a043b734128d86a1b15635.definition = {
    methods: ["post"],
    url: '/api/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/api/messages'
*/
storebf9a5229c3a043b734128d86a1b15635.url = (options?: RouteQueryOptions) => {
    return storebf9a5229c3a043b734128d86a1b15635.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/api/messages'
*/
storebf9a5229c3a043b734128d86a1b15635.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storebf9a5229c3a043b734128d86a1b15635.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/api/messages'
*/
const storebf9a5229c3a043b734128d86a1b15635Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storebf9a5229c3a043b734128d86a1b15635.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/api/messages'
*/
storebf9a5229c3a043b734128d86a1b15635Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storebf9a5229c3a043b734128d86a1b15635.url(options),
    method: 'post',
})

storebf9a5229c3a043b734128d86a1b15635.form = storebf9a5229c3a043b734128d86a1b15635Form
/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
const store0cfd3f41dfd3107ef703f9657bc8a357 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store0cfd3f41dfd3107ef703f9657bc8a357.url(options),
    method: 'post',
})

store0cfd3f41dfd3107ef703f9657bc8a357.definition = {
    methods: ["post"],
    url: '/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
store0cfd3f41dfd3107ef703f9657bc8a357.url = (options?: RouteQueryOptions) => {
    return store0cfd3f41dfd3107ef703f9657bc8a357.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
store0cfd3f41dfd3107ef703f9657bc8a357.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store0cfd3f41dfd3107ef703f9657bc8a357.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
const store0cfd3f41dfd3107ef703f9657bc8a357Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store0cfd3f41dfd3107ef703f9657bc8a357.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
store0cfd3f41dfd3107ef703f9657bc8a357Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store0cfd3f41dfd3107ef703f9657bc8a357.url(options),
    method: 'post',
})

store0cfd3f41dfd3107ef703f9657bc8a357.form = store0cfd3f41dfd3107ef703f9657bc8a357Form

export const store = {
    '/api/messages': storebf9a5229c3a043b734128d86a1b15635,
    '/messages': store0cfd3f41dfd3107ef703f9657bc8a357,
}

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
const getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, options),
    method: 'get',
})

getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
const getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1.form = getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1Form
/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
const getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, options),
    method: 'get',
})

getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
const getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getGroupMessages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/groups/{group}/messages'
*/
getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2.form = getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2Form

export const getGroupMessages = {
    '/api/user-groups/{group}/messages': getGroupMessages4fc54dda758d7f8f19b2f3fc792a54a1,
    '/api/groups/{group}/messages': getGroupMessagesb58e03e6bfd9adbe88852428c1f301d2,
}

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/api/messages/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
const unreadCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
unreadCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::unreadCount
* @see app/Http/Controllers/MessageController.php:587
* @route '/api/messages/unread-count'
*/
unreadCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

unreadCount.form = unreadCountForm

/**
* @see \App\Http\Controllers\MessageController::flag
* @see app/Http/Controllers/MessageController.php:467
* @route '/api/messages/{message}/flag'
*/
export const flag = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

flag.definition = {
    methods: ["post"],
    url: '/api/messages/{message}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::flag
* @see app/Http/Controllers/MessageController.php:467
* @route '/api/messages/{message}/flag'
*/
flag.url = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { message: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { message: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            message: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        message: typeof args.message === 'object'
        ? args.message.id
        : args.message,
    }

    return flag.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::flag
* @see app/Http/Controllers/MessageController.php:467
* @route '/api/messages/{message}/flag'
*/
flag.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::flag
* @see app/Http/Controllers/MessageController.php:467
* @route '/api/messages/{message}/flag'
*/
const flagForm = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::flag
* @see app/Http/Controllers/MessageController.php:467
* @route '/api/messages/{message}/flag'
*/
flagForm.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

flag.form = flagForm

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
export const getFlaggedMessages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedMessages.url(options),
    method: 'get',
})

getFlaggedMessages.definition = {
    methods: ["get","head"],
    url: '/api/admin/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
getFlaggedMessages.url = (options?: RouteQueryOptions) => {
    return getFlaggedMessages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
getFlaggedMessages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
getFlaggedMessages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFlaggedMessages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
const getFlaggedMessagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
getFlaggedMessagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedMessages
* @see app/Http/Controllers/MessageController.php:498
* @route '/api/admin/flagged-messages'
*/
getFlaggedMessagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedMessages.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getFlaggedMessages.form = getFlaggedMessagesForm

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
const getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, options),
    method: 'get',
})

getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
const getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033.form = getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033Form
/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
const getFlaggedGroupMessages680a735defbbda7b875edd91197146d6 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, options),
    method: 'get',
})

getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
const getFlaggedGroupMessages680a735defbbda7b875edd91197146d6Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
getFlaggedGroupMessages680a735defbbda7b875edd91197146d6Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getFlaggedGroupMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
getFlaggedGroupMessages680a735defbbda7b875edd91197146d6Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getFlaggedGroupMessages680a735defbbda7b875edd91197146d6.form = getFlaggedGroupMessages680a735defbbda7b875edd91197146d6Form

export const getFlaggedGroupMessages = {
    '/api/user-groups/{group}/flagged-messages': getFlaggedGroupMessagesd91d8f114e5843f9e676fddbb7315033,
    '/api/groups/{group}/flagged-messages': getFlaggedGroupMessages680a735defbbda7b875edd91197146d6,
}

/**
* @see \App\Http\Controllers\MessageController::resolveFlaggedMessage
* @see app/Http/Controllers/MessageController.php:534
* @route '/api/messages/{message}/resolve-flag'
*/
export const resolveFlaggedMessage = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveFlaggedMessage.url(args, options),
    method: 'post',
})

resolveFlaggedMessage.definition = {
    methods: ["post"],
    url: '/api/messages/{message}/resolve-flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::resolveFlaggedMessage
* @see app/Http/Controllers/MessageController.php:534
* @route '/api/messages/{message}/resolve-flag'
*/
resolveFlaggedMessage.url = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { message: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { message: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            message: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        message: typeof args.message === 'object'
        ? args.message.id
        : args.message,
    }

    return resolveFlaggedMessage.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::resolveFlaggedMessage
* @see app/Http/Controllers/MessageController.php:534
* @route '/api/messages/{message}/resolve-flag'
*/
resolveFlaggedMessage.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveFlaggedMessage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::resolveFlaggedMessage
* @see app/Http/Controllers/MessageController.php:534
* @route '/api/messages/{message}/resolve-flag'
*/
const resolveFlaggedMessageForm = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveFlaggedMessage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::resolveFlaggedMessage
* @see app/Http/Controllers/MessageController.php:534
* @route '/api/messages/{message}/resolve-flag'
*/
resolveFlaggedMessageForm.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveFlaggedMessage.url(args, options),
    method: 'post',
})

resolveFlaggedMessage.form = resolveFlaggedMessageForm

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
export const getModerationStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getModerationStats.url(options),
    method: 'get',
})

getModerationStats.definition = {
    methods: ["get","head"],
    url: '/api/admin/moderation-stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
getModerationStats.url = (options?: RouteQueryOptions) => {
    return getModerationStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
getModerationStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getModerationStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
getModerationStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getModerationStats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
const getModerationStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getModerationStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
getModerationStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getModerationStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::getModerationStats
* @see app/Http/Controllers/MessageController.php:570
* @route '/api/admin/moderation-stats'
*/
getModerationStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getModerationStats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getModerationStats.form = getModerationStatsForm

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::index
* @see app/Http/Controllers/MessageController.php:26
* @route '/messages'
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
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
export const conversation = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversation.url(args, options),
    method: 'get',
})

conversation.definition = {
    methods: ["get","head"],
    url: '/messages/conversation/{contact}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
conversation.url = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contact: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contact: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contact: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contact: typeof args.contact === 'object'
        ? args.contact.id
        : args.contact,
    }

    return conversation.definition.url
            .replace('{contact}', parsedArgs.contact.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
conversation.get = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
conversation.head = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conversation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
const conversationForm = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
conversationForm.get = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::conversation
* @see app/Http/Controllers/MessageController.php:45
* @route '/messages/conversation/{contact}'
*/
conversationForm.head = (args: { contact: number | { id: number } } | [contact: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

conversation.form = conversationForm

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
export const groups = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groups.url(options),
    method: 'get',
})

groups.definition = {
    methods: ["get","head"],
    url: '/messages/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
groups.url = (options?: RouteQueryOptions) => {
    return groups.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
groups.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groups.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
groups.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: groups.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
const groupsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groups.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
groupsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groups.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groups
* @see app/Http/Controllers/MessageController.php:114
* @route '/messages/groups'
*/
groupsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groups.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

groups.form = groupsForm

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
export const groupConversation = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupConversation.url(args, options),
    method: 'get',
})

groupConversation.definition = {
    methods: ["get","head"],
    url: '/messages/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
groupConversation.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return groupConversation.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
groupConversation.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
groupConversation.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: groupConversation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
const groupConversationForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
groupConversationForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupConversation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::groupConversation
* @see app/Http/Controllers/MessageController.php:160
* @route '/messages/groups/{group}'
*/
groupConversationForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupConversation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

groupConversation.form = groupConversationForm

const MessageController = { store, getGroupMessages, unreadCount, flag, getFlaggedMessages, getFlaggedGroupMessages, resolveFlaggedMessage, getModerationStats, index, conversation, groups, groupConversation }

export default MessageController