import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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

const email = {
    unsubscribe: Object.assign(unsubscribe, unsubscribe),
}

export default email