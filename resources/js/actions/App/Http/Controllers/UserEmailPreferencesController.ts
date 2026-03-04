import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/user/email-preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::show
* @see app/Http/Controllers/UserEmailPreferencesController.php:15
* @route '/api/user/email-preferences'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::update
* @see app/Http/Controllers/UserEmailPreferencesController.php:39
* @route '/api/user/email-preferences'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/user/email-preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::update
* @see app/Http/Controllers/UserEmailPreferencesController.php:39
* @route '/api/user/email-preferences'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::update
* @see app/Http/Controllers/UserEmailPreferencesController.php:39
* @route '/api/user/email-preferences'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::update
* @see app/Http/Controllers/UserEmailPreferencesController.php:39
* @route '/api/user/email-preferences'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::update
* @see app/Http/Controllers/UserEmailPreferencesController.php:39
* @route '/api/user/email-preferences'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
export const getUnsubscribeToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUnsubscribeToken.url(options),
    method: 'get',
})

getUnsubscribeToken.definition = {
    methods: ["get","head"],
    url: '/api/user/unsubscribe-token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
getUnsubscribeToken.url = (options?: RouteQueryOptions) => {
    return getUnsubscribeToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
getUnsubscribeToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUnsubscribeToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
getUnsubscribeToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUnsubscribeToken.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
const getUnsubscribeTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUnsubscribeToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
getUnsubscribeTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUnsubscribeToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::getUnsubscribeToken
* @see app/Http/Controllers/UserEmailPreferencesController.php:62
* @route '/api/user/unsubscribe-token'
*/
getUnsubscribeTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUnsubscribeToken.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUnsubscribeToken.form = getUnsubscribeTokenForm

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
export const unsubscribe = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsubscribe.url(args, options),
    method: 'get',
})

unsubscribe.definition = {
    methods: ["get","head"],
    url: '/unsubscribe/{userId}/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
unsubscribe.url = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            userId: args[0],
            token: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        userId: args.userId,
        token: args.token,
    }

    return unsubscribe.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
unsubscribe.get = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsubscribe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
unsubscribe.head = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unsubscribe.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
const unsubscribeForm = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unsubscribe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
unsubscribeForm.get = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unsubscribe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserEmailPreferencesController::unsubscribe
* @see app/Http/Controllers/UserEmailPreferencesController.php:77
* @route '/unsubscribe/{userId}/{token}'
*/
unsubscribeForm.head = (args: { userId: string | number, token: string | number } | [userId: string | number, token: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unsubscribe.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

unsubscribe.form = unsubscribeForm

const UserEmailPreferencesController = { show, update, getUnsubscribeToken, unsubscribe }

export default UserEmailPreferencesController