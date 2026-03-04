import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MessageController::store
* @see app/Http/Controllers/MessageController.php:251
* @route '/messages'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flag
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
export const flag = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

flag.definition = {
    methods: ["post"],
    url: '/messages/{message}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flag
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
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
* @see \App\Http\Controllers\Admin\ContentModerationController::flag
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
flag.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flag
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
const flagForm = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flag
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
flagForm.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

flag.form = flagForm

const messages = {
    unreadCount: Object.assign(unreadCount, unreadCount),
    index: Object.assign(index, index),
    conversation: Object.assign(conversation, conversation),
    groups: Object.assign(groups, groups),
    groupConversation: Object.assign(groupConversation, groupConversation),
    store: Object.assign(store, store),
    flag: Object.assign(flag, flag),
}

export default messages