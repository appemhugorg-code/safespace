import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import index801d9f from './index'
import storeE72b01 from './store'
import showBac614 from './show'
import update603324 from './update'
import destroy1af68e from './destroy'
import searchD2f59a from './search'
import manageable8aae0a from './manageable'
import statistics78a31d from './statistics'
import joinRequest22bed7 from './join-request'
import joinRequests611ee9 from './join-requests'
import reviewJoinRequest7c2137 from './review-join-request'
import addMember8bb9e4 from './add-member'
import removeMemberAa218d from './remove-member'
import leaveD5e2cf from './leave'
import leaveLogs80863b from './leave-logs'
import leaveReasonsSummaryE4a473 from './leave-reasons-summary'
import messages4ba6e9 from './messages'
import flaggedMessagesD2dda1 from './flagged-messages'
/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/user-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
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
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/user-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
export const show = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_group: args.user_group,
    }

    return show.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show.get = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show.head = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
const showForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
showForm.get = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
showForm.head = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
export const update = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_group: args.user_group,
    }

    return update.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update.put = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update.patch = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
const updateForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
updateForm.put = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
updateForm.patch = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
export const destroy = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
destroy.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_group: args.user_group,
    }

    return destroy.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
destroy.delete = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
const destroyForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
destroyForm.delete = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/search/available',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
export const manageable = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageable.url(options),
    method: 'get',
})

manageable.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/manageable/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageable.url = (options?: RouteQueryOptions) => {
    return manageable.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageable.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageable.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageable.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
const manageableForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageableForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageableForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageable.form = manageableForm

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
export const statistics = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(args, options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return statistics.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
const statisticsForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statisticsForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statisticsForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statistics.form = statisticsForm

/**
* @see \App\Http\Controllers\GroupController::joinRequest
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
export const joinRequest = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: joinRequest.url(args, options),
    method: 'post',
})

joinRequest.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/join-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::joinRequest
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
joinRequest.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinRequest.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::joinRequest
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
joinRequest.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: joinRequest.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequest
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
const joinRequestForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: joinRequest.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequest
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
joinRequestForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: joinRequest.url(args, options),
    method: 'post',
})

joinRequest.form = joinRequestForm

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
export const joinRequests = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests.url(args, options),
    method: 'get',
})

joinRequests.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/join-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinRequests.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinRequests.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
const joinRequestsForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequestsForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequestsForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

joinRequests.form = joinRequestsForm

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
export const reviewJoinRequest = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest.url(args, options),
    method: 'put',
})

reviewJoinRequest.definition = {
    methods: ["put"],
    url: '/api/user-groups/{group}/join-requests/{request}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
reviewJoinRequest.url = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            group: args[0],
            request: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
        request: args.request,
    }

    return reviewJoinRequest.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
reviewJoinRequest.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
const reviewJoinRequestForm = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
reviewJoinRequestForm.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reviewJoinRequest.form = reviewJoinRequestForm

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
export const myJoinRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myJoinRequests.url(options),
    method: 'get',
})

myJoinRequests.definition = {
    methods: ["get","head"],
    url: '/api/my-join-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
myJoinRequests.url = (options?: RouteQueryOptions) => {
    return myJoinRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
myJoinRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myJoinRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
myJoinRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myJoinRequests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
const myJoinRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myJoinRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
myJoinRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myJoinRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::myJoinRequests
* @see app/Http/Controllers/GroupController.php:362
* @route '/api/my-join-requests'
*/
myJoinRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myJoinRequests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

myJoinRequests.form = myJoinRequestsForm

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
export const addMember = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember.url(args, options),
    method: 'post',
})

addMember.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMember.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return addMember.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMember.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
const addMemberForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMemberForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember.url(args, options),
    method: 'post',
})

addMember.form = addMemberForm

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
export const removeMember = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

removeMember.definition = {
    methods: ["delete"],
    url: '/api/user-groups/{group}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
removeMember.url = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            group: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
        user: args.user,
    }

    return removeMember.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
removeMember.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
const removeMemberForm = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
removeMemberForm.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMember.form = removeMemberForm

/**
* @see \App\Http\Controllers\GroupController::leave
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
export const leave = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

leave.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::leave
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leave.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leave.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leave
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leave.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leave
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
const leaveForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leave.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leave
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leaveForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leave.url(args, options),
    method: 'post',
})

leave.form = leaveForm

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
export const leaveLogs = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogs.url(args, options),
    method: 'get',
})

leaveLogs.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/leave-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogs.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveLogs.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogs.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogs.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveLogs.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
const leaveLogsForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogs.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveLogs.form = leaveLogsForm

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
export const leaveReasonsSummary = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummary.url(args, options),
    method: 'get',
})

leaveReasonsSummary.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/leave-reasons-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummary.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveReasonsSummary.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummary.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummary.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveReasonsSummary.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
const leaveReasonsSummaryForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummary.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveReasonsSummary.form = leaveReasonsSummaryForm

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
export const messages = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
messages.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return messages.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
messages.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
messages.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
const messagesForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
messagesForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::messages
* @see app/Http/Controllers/MessageController.php:214
* @route '/api/user-groups/{group}/messages'
*/
messagesForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

messages.form = messagesForm

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
export const flaggedMessages = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(args, options),
    method: 'get',
})

flaggedMessages.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
flaggedMessages.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return flaggedMessages.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
flaggedMessages.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
flaggedMessages.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: flaggedMessages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
const flaggedMessagesForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
flaggedMessagesForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::flaggedMessages
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/user-groups/{group}/flagged-messages'
*/
flaggedMessagesForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

flaggedMessages.form = flaggedMessagesForm

const groups = {
    index: Object.assign(index, index801d9f),
    store: Object.assign(store, storeE72b01),
    show: Object.assign(show, showBac614),
    update: Object.assign(update, update603324),
    destroy: Object.assign(destroy, destroy1af68e),
    search: Object.assign(search, searchD2f59a),
    manageable: Object.assign(manageable, manageable8aae0a),
    statistics: Object.assign(statistics, statistics78a31d),
    joinRequest: Object.assign(joinRequest, joinRequest22bed7),
    joinRequests: Object.assign(joinRequests, joinRequests611ee9),
    reviewJoinRequest: Object.assign(reviewJoinRequest, reviewJoinRequest7c2137),
    myJoinRequests: Object.assign(myJoinRequests, myJoinRequests),
    addMember: Object.assign(addMember, addMember8bb9e4),
    removeMember: Object.assign(removeMember, removeMemberAa218d),
    leave: Object.assign(leave, leaveD5e2cf),
    leaveLogs: Object.assign(leaveLogs, leaveLogs80863b),
    leaveReasonsSummary: Object.assign(leaveReasonsSummary, leaveReasonsSummaryE4a473),
    messages: Object.assign(messages, messages4ba6e9),
    flaggedMessages: Object.assign(flaggedMessages, flaggedMessagesD2dda1),
}

export default groups