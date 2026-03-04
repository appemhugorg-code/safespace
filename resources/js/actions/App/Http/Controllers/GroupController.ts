import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
const indexb606b8fe4ed0c59279aa45c252a5c5cd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'get',
})

indexb606b8fe4ed0c59279aa45c252a5c5cd.definition = {
    methods: ["get","head"],
    url: '/api/user-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexb606b8fe4ed0c59279aa45c252a5c5cd.url = (options?: RouteQueryOptions) => {
    return indexb606b8fe4ed0c59279aa45c252a5c5cd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexb606b8fe4ed0c59279aa45c252a5c5cd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexb606b8fe4ed0c59279aa45c252a5c5cd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
const indexb606b8fe4ed0c59279aa45c252a5c5cdForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexb606b8fe4ed0c59279aa45c252a5c5cdForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/user-groups'
*/
indexb606b8fe4ed0c59279aa45c252a5c5cdForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb606b8fe4ed0c59279aa45c252a5c5cd.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexb606b8fe4ed0c59279aa45c252a5c5cd.form = indexb606b8fe4ed0c59279aa45c252a5c5cdForm
/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
const indexa5868c186e4dbec94ce838edbeb604d0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexa5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'get',
})

indexa5868c186e4dbec94ce838edbeb604d0.definition = {
    methods: ["get","head"],
    url: '/api/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
indexa5868c186e4dbec94ce838edbeb604d0.url = (options?: RouteQueryOptions) => {
    return indexa5868c186e4dbec94ce838edbeb604d0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
indexa5868c186e4dbec94ce838edbeb604d0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexa5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
indexa5868c186e4dbec94ce838edbeb604d0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexa5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
const indexa5868c186e4dbec94ce838edbeb604d0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexa5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
indexa5868c186e4dbec94ce838edbeb604d0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexa5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::index
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
indexa5868c186e4dbec94ce838edbeb604d0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexa5868c186e4dbec94ce838edbeb604d0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexa5868c186e4dbec94ce838edbeb604d0.form = indexa5868c186e4dbec94ce838edbeb604d0Form

export const index = {
    '/api/user-groups': indexb606b8fe4ed0c59279aa45c252a5c5cd,
    '/api/groups': indexa5868c186e4dbec94ce838edbeb604d0,
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
const storeb606b8fe4ed0c59279aa45c252a5c5cd = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'post',
})

storeb606b8fe4ed0c59279aa45c252a5c5cd.definition = {
    methods: ["post"],
    url: '/api/user-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
storeb606b8fe4ed0c59279aa45c252a5c5cd.url = (options?: RouteQueryOptions) => {
    return storeb606b8fe4ed0c59279aa45c252a5c5cd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
storeb606b8fe4ed0c59279aa45c252a5c5cd.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
const storeb606b8fe4ed0c59279aa45c252a5c5cdForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/user-groups'
*/
storeb606b8fe4ed0c59279aa45c252a5c5cdForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb606b8fe4ed0c59279aa45c252a5c5cd.url(options),
    method: 'post',
})

storeb606b8fe4ed0c59279aa45c252a5c5cd.form = storeb606b8fe4ed0c59279aa45c252a5c5cdForm
/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
const storea5868c186e4dbec94ce838edbeb604d0 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storea5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'post',
})

storea5868c186e4dbec94ce838edbeb604d0.definition = {
    methods: ["post"],
    url: '/api/groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
storea5868c186e4dbec94ce838edbeb604d0.url = (options?: RouteQueryOptions) => {
    return storea5868c186e4dbec94ce838edbeb604d0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
storea5868c186e4dbec94ce838edbeb604d0.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storea5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
const storea5868c186e4dbec94ce838edbeb604d0Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storea5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
storea5868c186e4dbec94ce838edbeb604d0Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storea5868c186e4dbec94ce838edbeb604d0.url(options),
    method: 'post',
})

storea5868c186e4dbec94ce838edbeb604d0.form = storea5868c186e4dbec94ce838edbeb604d0Form
/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
const store559a96fa8b1910ee203a0d67c7623515 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store559a96fa8b1910ee203a0d67c7623515.url(options),
    method: 'post',
})

store559a96fa8b1910ee203a0d67c7623515.definition = {
    methods: ["post"],
    url: '/groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
store559a96fa8b1910ee203a0d67c7623515.url = (options?: RouteQueryOptions) => {
    return store559a96fa8b1910ee203a0d67c7623515.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
store559a96fa8b1910ee203a0d67c7623515.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store559a96fa8b1910ee203a0d67c7623515.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
const store559a96fa8b1910ee203a0d67c7623515Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store559a96fa8b1910ee203a0d67c7623515.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
store559a96fa8b1910ee203a0d67c7623515Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store559a96fa8b1910ee203a0d67c7623515.url(options),
    method: 'post',
})

store559a96fa8b1910ee203a0d67c7623515.form = store559a96fa8b1910ee203a0d67c7623515Form

export const store = {
    '/api/user-groups': storeb606b8fe4ed0c59279aa45c252a5c5cd,
    '/api/groups': storea5868c186e4dbec94ce838edbeb604d0,
    '/groups': store559a96fa8b1910ee203a0d67c7623515,
}

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
const show9a379886a98b37b7f3ddce08348eaf2f = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'get',
})

show9a379886a98b37b7f3ddce08348eaf2f.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show9a379886a98b37b7f3ddce08348eaf2f.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show9a379886a98b37b7f3ddce08348eaf2f.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show9a379886a98b37b7f3ddce08348eaf2f.get = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show9a379886a98b37b7f3ddce08348eaf2f.head = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
const show9a379886a98b37b7f3ddce08348eaf2fForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show9a379886a98b37b7f3ddce08348eaf2fForm.get = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/user-groups/{user_group}'
*/
show9a379886a98b37b7f3ddce08348eaf2fForm.head = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show9a379886a98b37b7f3ddce08348eaf2f.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show9a379886a98b37b7f3ddce08348eaf2f.form = show9a379886a98b37b7f3ddce08348eaf2fForm
/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
const show2c96974f3bd30422a9c57067f0e90521 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'get',
})

show2c96974f3bd30422a9c57067f0e90521.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
show2c96974f3bd30422a9c57067f0e90521.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show2c96974f3bd30422a9c57067f0e90521.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
show2c96974f3bd30422a9c57067f0e90521.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
show2c96974f3bd30422a9c57067f0e90521.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
const show2c96974f3bd30422a9c57067f0e90521Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
show2c96974f3bd30422a9c57067f0e90521Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::show
* @see app/Http/Controllers/GroupController.php:115
* @route '/api/groups/{group}'
*/
show2c96974f3bd30422a9c57067f0e90521Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show2c96974f3bd30422a9c57067f0e90521.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show2c96974f3bd30422a9c57067f0e90521.form = show2c96974f3bd30422a9c57067f0e90521Form

export const show = {
    '/api/user-groups/{user_group}': show9a379886a98b37b7f3ddce08348eaf2f,
    '/api/groups/{group}': show2c96974f3bd30422a9c57067f0e90521,
}

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
const update9a379886a98b37b7f3ddce08348eaf2f = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'put',
})

update9a379886a98b37b7f3ddce08348eaf2f.definition = {
    methods: ["put","patch"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update9a379886a98b37b7f3ddce08348eaf2f.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update9a379886a98b37b7f3ddce08348eaf2f.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update9a379886a98b37b7f3ddce08348eaf2f.put = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
update9a379886a98b37b7f3ddce08348eaf2f.patch = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/user-groups/{user_group}'
*/
const update9a379886a98b37b7f3ddce08348eaf2fForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update9a379886a98b37b7f3ddce08348eaf2f.url(args, {
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
update9a379886a98b37b7f3ddce08348eaf2fForm.put = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update9a379886a98b37b7f3ddce08348eaf2f.url(args, {
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
update9a379886a98b37b7f3ddce08348eaf2fForm.patch = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update9a379886a98b37b7f3ddce08348eaf2f.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update9a379886a98b37b7f3ddce08348eaf2f.form = update9a379886a98b37b7f3ddce08348eaf2fForm
/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/groups/{group}'
*/
const update2c96974f3bd30422a9c57067f0e90521 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'put',
})

update2c96974f3bd30422a9c57067f0e90521.definition = {
    methods: ["put","patch"],
    url: '/api/groups/{group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/groups/{group}'
*/
update2c96974f3bd30422a9c57067f0e90521.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update2c96974f3bd30422a9c57067f0e90521.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/groups/{group}'
*/
update2c96974f3bd30422a9c57067f0e90521.put = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/groups/{group}'
*/
update2c96974f3bd30422a9c57067f0e90521.patch = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GroupController::update
* @see app/Http/Controllers/GroupController.php:135
* @route '/api/groups/{group}'
*/
const update2c96974f3bd30422a9c57067f0e90521Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update2c96974f3bd30422a9c57067f0e90521.url(args, {
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
* @route '/api/groups/{group}'
*/
update2c96974f3bd30422a9c57067f0e90521Form.put = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update2c96974f3bd30422a9c57067f0e90521.url(args, {
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
* @route '/api/groups/{group}'
*/
update2c96974f3bd30422a9c57067f0e90521Form.patch = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update2c96974f3bd30422a9c57067f0e90521.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update2c96974f3bd30422a9c57067f0e90521.form = update2c96974f3bd30422a9c57067f0e90521Form

export const update = {
    '/api/user-groups/{user_group}': update9a379886a98b37b7f3ddce08348eaf2f,
    '/api/groups/{group}': update2c96974f3bd30422a9c57067f0e90521,
}

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
const destroy9a379886a98b37b7f3ddce08348eaf2f = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'delete',
})

destroy9a379886a98b37b7f3ddce08348eaf2f.definition = {
    methods: ["delete"],
    url: '/api/user-groups/{user_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
destroy9a379886a98b37b7f3ddce08348eaf2f.url = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy9a379886a98b37b7f3ddce08348eaf2f.definition.url
            .replace('{user_group}', parsedArgs.user_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
destroy9a379886a98b37b7f3ddce08348eaf2f.delete = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy9a379886a98b37b7f3ddce08348eaf2f.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/user-groups/{user_group}'
*/
const destroy9a379886a98b37b7f3ddce08348eaf2fForm = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy9a379886a98b37b7f3ddce08348eaf2f.url(args, {
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
destroy9a379886a98b37b7f3ddce08348eaf2fForm.delete = (args: { user_group: string | number } | [user_group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy9a379886a98b37b7f3ddce08348eaf2f.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy9a379886a98b37b7f3ddce08348eaf2f.form = destroy9a379886a98b37b7f3ddce08348eaf2fForm
/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/groups/{group}'
*/
const destroy2c96974f3bd30422a9c57067f0e90521 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'delete',
})

destroy2c96974f3bd30422a9c57067f0e90521.definition = {
    methods: ["delete"],
    url: '/api/groups/{group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/groups/{group}'
*/
destroy2c96974f3bd30422a9c57067f0e90521.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy2c96974f3bd30422a9c57067f0e90521.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/groups/{group}'
*/
destroy2c96974f3bd30422a9c57067f0e90521.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy2c96974f3bd30422a9c57067f0e90521.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::destroy
* @see app/Http/Controllers/GroupController.php:149
* @route '/api/groups/{group}'
*/
const destroy2c96974f3bd30422a9c57067f0e90521Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy2c96974f3bd30422a9c57067f0e90521.url(args, {
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
* @route '/api/groups/{group}'
*/
destroy2c96974f3bd30422a9c57067f0e90521Form.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy2c96974f3bd30422a9c57067f0e90521.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy2c96974f3bd30422a9c57067f0e90521.form = destroy2c96974f3bd30422a9c57067f0e90521Form

export const destroy = {
    '/api/user-groups/{user_group}': destroy9a379886a98b37b7f3ddce08348eaf2f,
    '/api/groups/{group}': destroy2c96974f3bd30422a9c57067f0e90521,
}

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
const search3ecebb0c97dd311196eb8b4fc0eb4658 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search3ecebb0c97dd311196eb8b4fc0eb4658.url(options),
    method: 'get',
})

search3ecebb0c97dd311196eb8b4fc0eb4658.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/search/available',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search3ecebb0c97dd311196eb8b4fc0eb4658.url = (options?: RouteQueryOptions) => {
    return search3ecebb0c97dd311196eb8b4fc0eb4658.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search3ecebb0c97dd311196eb8b4fc0eb4658.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search3ecebb0c97dd311196eb8b4fc0eb4658.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search3ecebb0c97dd311196eb8b4fc0eb4658.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search3ecebb0c97dd311196eb8b4fc0eb4658.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
const search3ecebb0c97dd311196eb8b4fc0eb4658Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search3ecebb0c97dd311196eb8b4fc0eb4658.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search3ecebb0c97dd311196eb8b4fc0eb4658Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search3ecebb0c97dd311196eb8b4fc0eb4658.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/user-groups/search/available'
*/
search3ecebb0c97dd311196eb8b4fc0eb4658Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search3ecebb0c97dd311196eb8b4fc0eb4658.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search3ecebb0c97dd311196eb8b4fc0eb4658.form = search3ecebb0c97dd311196eb8b4fc0eb4658Form
/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
const search02c827b0561b0bd3956c72a9649d7733 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search02c827b0561b0bd3956c72a9649d7733.url(options),
    method: 'get',
})

search02c827b0561b0bd3956c72a9649d7733.definition = {
    methods: ["get","head"],
    url: '/api/groups/search/available',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
search02c827b0561b0bd3956c72a9649d7733.url = (options?: RouteQueryOptions) => {
    return search02c827b0561b0bd3956c72a9649d7733.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
search02c827b0561b0bd3956c72a9649d7733.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search02c827b0561b0bd3956c72a9649d7733.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
search02c827b0561b0bd3956c72a9649d7733.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search02c827b0561b0bd3956c72a9649d7733.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
const search02c827b0561b0bd3956c72a9649d7733Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search02c827b0561b0bd3956c72a9649d7733.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
search02c827b0561b0bd3956c72a9649d7733Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search02c827b0561b0bd3956c72a9649d7733.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::search
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
search02c827b0561b0bd3956c72a9649d7733Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search02c827b0561b0bd3956c72a9649d7733.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search02c827b0561b0bd3956c72a9649d7733.form = search02c827b0561b0bd3956c72a9649d7733Form

export const search = {
    '/api/user-groups/search/available': search3ecebb0c97dd311196eb8b4fc0eb4658,
    '/api/groups/search/available': search02c827b0561b0bd3956c72a9649d7733,
}

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
const manageablec22325ef1d45195a73f8217240141990 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageablec22325ef1d45195a73f8217240141990.url(options),
    method: 'get',
})

manageablec22325ef1d45195a73f8217240141990.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/manageable/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageablec22325ef1d45195a73f8217240141990.url = (options?: RouteQueryOptions) => {
    return manageablec22325ef1d45195a73f8217240141990.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageablec22325ef1d45195a73f8217240141990.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageablec22325ef1d45195a73f8217240141990.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageablec22325ef1d45195a73f8217240141990.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageablec22325ef1d45195a73f8217240141990.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
const manageablec22325ef1d45195a73f8217240141990Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageablec22325ef1d45195a73f8217240141990.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageablec22325ef1d45195a73f8217240141990Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageablec22325ef1d45195a73f8217240141990.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/user-groups/manageable/list'
*/
manageablec22325ef1d45195a73f8217240141990Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageablec22325ef1d45195a73f8217240141990.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageablec22325ef1d45195a73f8217240141990.form = manageablec22325ef1d45195a73f8217240141990Form
/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
const manageable20afe40df4ec329f752e53c2a71c0498 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageable20afe40df4ec329f752e53c2a71c0498.url(options),
    method: 'get',
})

manageable20afe40df4ec329f752e53c2a71c0498.definition = {
    methods: ["get","head"],
    url: '/api/groups/manageable/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
manageable20afe40df4ec329f752e53c2a71c0498.url = (options?: RouteQueryOptions) => {
    return manageable20afe40df4ec329f752e53c2a71c0498.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
manageable20afe40df4ec329f752e53c2a71c0498.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageable20afe40df4ec329f752e53c2a71c0498.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
manageable20afe40df4ec329f752e53c2a71c0498.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageable20afe40df4ec329f752e53c2a71c0498.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
const manageable20afe40df4ec329f752e53c2a71c0498Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable20afe40df4ec329f752e53c2a71c0498.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
manageable20afe40df4ec329f752e53c2a71c0498Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable20afe40df4ec329f752e53c2a71c0498.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::manageable
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
manageable20afe40df4ec329f752e53c2a71c0498Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageable20afe40df4ec329f752e53c2a71c0498.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageable20afe40df4ec329f752e53c2a71c0498.form = manageable20afe40df4ec329f752e53c2a71c0498Form

export const manageable = {
    '/api/user-groups/manageable/list': manageablec22325ef1d45195a73f8217240141990,
    '/api/groups/manageable/list': manageable20afe40df4ec329f752e53c2a71c0498,
}

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
const statistics20ba3b92878a26ec09a32f4291454d3b = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, options),
    method: 'get',
})

statistics20ba3b92878a26ec09a32f4291454d3b.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics20ba3b92878a26ec09a32f4291454d3b.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return statistics20ba3b92878a26ec09a32f4291454d3b.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics20ba3b92878a26ec09a32f4291454d3b.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics20ba3b92878a26ec09a32f4291454d3b.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
const statistics20ba3b92878a26ec09a32f4291454d3bForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics20ba3b92878a26ec09a32f4291454d3bForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/user-groups/{group}/statistics'
*/
statistics20ba3b92878a26ec09a32f4291454d3bForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics20ba3b92878a26ec09a32f4291454d3b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statistics20ba3b92878a26ec09a32f4291454d3b.form = statistics20ba3b92878a26ec09a32f4291454d3bForm
/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
const statisticsd672c4cd802bd99982cbd768ca39ec2e = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, options),
    method: 'get',
})

statisticsd672c4cd802bd99982cbd768ca39ec2e.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
statisticsd672c4cd802bd99982cbd768ca39ec2e.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return statisticsd672c4cd802bd99982cbd768ca39ec2e.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
statisticsd672c4cd802bd99982cbd768ca39ec2e.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
statisticsd672c4cd802bd99982cbd768ca39ec2e.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
const statisticsd672c4cd802bd99982cbd768ca39ec2eForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
statisticsd672c4cd802bd99982cbd768ca39ec2eForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::statistics
* @see app/Http/Controllers/GroupController.php:204
* @route '/api/groups/{group}/statistics'
*/
statisticsd672c4cd802bd99982cbd768ca39ec2eForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statisticsd672c4cd802bd99982cbd768ca39ec2e.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statisticsd672c4cd802bd99982cbd768ca39ec2e.form = statisticsd672c4cd802bd99982cbd768ca39ec2eForm

export const statistics = {
    '/api/user-groups/{group}/statistics': statistics20ba3b92878a26ec09a32f4291454d3b,
    '/api/groups/{group}/statistics': statisticsd672c4cd802bd99982cbd768ca39ec2e,
}

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
const requestJoin10153b2bc35fbfd32d9c6c920b25d0a4 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.url(args, options),
    method: 'post',
})

requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/join-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
const requestJoin10153b2bc35fbfd32d9c6c920b25d0a4Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/user-groups/{group}/join-request'
*/
requestJoin10153b2bc35fbfd32d9c6c920b25d0a4Form.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.url(args, options),
    method: 'post',
})

requestJoin10153b2bc35fbfd32d9c6c920b25d0a4.form = requestJoin10153b2bc35fbfd32d9c6c920b25d0a4Form
/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/groups/{group}/join-request'
*/
const requestJoine8c837e04a568a32e92263f7c43f1598 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestJoine8c837e04a568a32e92263f7c43f1598.url(args, options),
    method: 'post',
})

requestJoine8c837e04a568a32e92263f7c43f1598.definition = {
    methods: ["post"],
    url: '/api/groups/{group}/join-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/groups/{group}/join-request'
*/
requestJoine8c837e04a568a32e92263f7c43f1598.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return requestJoine8c837e04a568a32e92263f7c43f1598.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/groups/{group}/join-request'
*/
requestJoine8c837e04a568a32e92263f7c43f1598.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestJoine8c837e04a568a32e92263f7c43f1598.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/groups/{group}/join-request'
*/
const requestJoine8c837e04a568a32e92263f7c43f1598Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestJoine8c837e04a568a32e92263f7c43f1598.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::requestJoin
* @see app/Http/Controllers/GroupController.php:241
* @route '/api/groups/{group}/join-request'
*/
requestJoine8c837e04a568a32e92263f7c43f1598Form.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestJoine8c837e04a568a32e92263f7c43f1598.url(args, options),
    method: 'post',
})

requestJoine8c837e04a568a32e92263f7c43f1598.form = requestJoine8c837e04a568a32e92263f7c43f1598Form

export const requestJoin = {
    '/api/user-groups/{group}/join-request': requestJoin10153b2bc35fbfd32d9c6c920b25d0a4,
    '/api/groups/{group}/join-request': requestJoine8c837e04a568a32e92263f7c43f1598,
}

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
const joinRequests11ad9434967d48c232bb0151c3fb412c = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, options),
    method: 'get',
})

joinRequests11ad9434967d48c232bb0151c3fb412c.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/join-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests11ad9434967d48c232bb0151c3fb412c.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinRequests11ad9434967d48c232bb0151c3fb412c.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests11ad9434967d48c232bb0151c3fb412c.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests11ad9434967d48c232bb0151c3fb412c.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
const joinRequests11ad9434967d48c232bb0151c3fb412cForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests11ad9434967d48c232bb0151c3fb412cForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/user-groups/{group}/join-requests'
*/
joinRequests11ad9434967d48c232bb0151c3fb412cForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests11ad9434967d48c232bb0151c3fb412c.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

joinRequests11ad9434967d48c232bb0151c3fb412c.form = joinRequests11ad9434967d48c232bb0151c3fb412cForm
/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
const joinRequests258ea573e965d1af7bc455a7809fe819 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, options),
    method: 'get',
})

joinRequests258ea573e965d1af7bc455a7809fe819.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/join-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
joinRequests258ea573e965d1af7bc455a7809fe819.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinRequests258ea573e965d1af7bc455a7809fe819.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
joinRequests258ea573e965d1af7bc455a7809fe819.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
joinRequests258ea573e965d1af7bc455a7809fe819.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
const joinRequests258ea573e965d1af7bc455a7809fe819Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
joinRequests258ea573e965d1af7bc455a7809fe819Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::joinRequests
* @see app/Http/Controllers/GroupController.php:287
* @route '/api/groups/{group}/join-requests'
*/
joinRequests258ea573e965d1af7bc455a7809fe819Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: joinRequests258ea573e965d1af7bc455a7809fe819.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

joinRequests258ea573e965d1af7bc455a7809fe819.form = joinRequests258ea573e965d1af7bc455a7809fe819Form

export const joinRequests = {
    '/api/user-groups/{group}/join-requests': joinRequests11ad9434967d48c232bb0151c3fb412c,
    '/api/groups/{group}/join-requests': joinRequests258ea573e965d1af7bc455a7809fe819,
}

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
const reviewJoinRequest35261d92d472c5f351eced608cd16c8e = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest35261d92d472c5f351eced608cd16c8e.url(args, options),
    method: 'put',
})

reviewJoinRequest35261d92d472c5f351eced608cd16c8e.definition = {
    methods: ["put"],
    url: '/api/user-groups/{group}/join-requests/{request}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
reviewJoinRequest35261d92d472c5f351eced608cd16c8e.url = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions) => {
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

    return reviewJoinRequest35261d92d472c5f351eced608cd16c8e.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
reviewJoinRequest35261d92d472c5f351eced608cd16c8e.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest35261d92d472c5f351eced608cd16c8e.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/user-groups/{group}/join-requests/{request}'
*/
const reviewJoinRequest35261d92d472c5f351eced608cd16c8eForm = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest35261d92d472c5f351eced608cd16c8e.url(args, {
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
reviewJoinRequest35261d92d472c5f351eced608cd16c8eForm.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest35261d92d472c5f351eced608cd16c8e.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reviewJoinRequest35261d92d472c5f351eced608cd16c8e.form = reviewJoinRequest35261d92d472c5f351eced608cd16c8eForm
/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
const reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.url(args, options),
    method: 'put',
})

reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.definition = {
    methods: ["put"],
    url: '/api/groups/{group}/join-requests/{request}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.url = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions) => {
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

    return reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::reviewJoinRequest
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
const reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ffForm = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.url(args, {
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
* @route '/api/groups/{group}/join-requests/{request}'
*/
reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ffForm.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff.form = reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ffForm

export const reviewJoinRequest = {
    '/api/user-groups/{group}/join-requests/{request}': reviewJoinRequest35261d92d472c5f351eced608cd16c8e,
    '/api/groups/{group}/join-requests/{request}': reviewJoinRequest19d9666b217f0b25ed82d3f796ddd3ff,
}

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
const addMember160ae207d82edb4dc23eaa1b8e9bf391 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember160ae207d82edb4dc23eaa1b8e9bf391.url(args, options),
    method: 'post',
})

addMember160ae207d82edb4dc23eaa1b8e9bf391.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMember160ae207d82edb4dc23eaa1b8e9bf391.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return addMember160ae207d82edb4dc23eaa1b8e9bf391.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMember160ae207d82edb4dc23eaa1b8e9bf391.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember160ae207d82edb4dc23eaa1b8e9bf391.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
const addMember160ae207d82edb4dc23eaa1b8e9bf391Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember160ae207d82edb4dc23eaa1b8e9bf391.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/user-groups/{group}/members'
*/
addMember160ae207d82edb4dc23eaa1b8e9bf391Form.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember160ae207d82edb4dc23eaa1b8e9bf391.url(args, options),
    method: 'post',
})

addMember160ae207d82edb4dc23eaa1b8e9bf391.form = addMember160ae207d82edb4dc23eaa1b8e9bf391Form
/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/groups/{group}/members'
*/
const addMember210edebb545d12343c56c8ccd1dc1e0d = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember210edebb545d12343c56c8ccd1dc1e0d.url(args, options),
    method: 'post',
})

addMember210edebb545d12343c56c8ccd1dc1e0d.definition = {
    methods: ["post"],
    url: '/api/groups/{group}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/groups/{group}/members'
*/
addMember210edebb545d12343c56c8ccd1dc1e0d.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return addMember210edebb545d12343c56c8ccd1dc1e0d.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/groups/{group}/members'
*/
addMember210edebb545d12343c56c8ccd1dc1e0d.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember210edebb545d12343c56c8ccd1dc1e0d.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/groups/{group}/members'
*/
const addMember210edebb545d12343c56c8ccd1dc1e0dForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember210edebb545d12343c56c8ccd1dc1e0d.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::addMember
* @see app/Http/Controllers/GroupController.php:498
* @route '/api/groups/{group}/members'
*/
addMember210edebb545d12343c56c8ccd1dc1e0dForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMember210edebb545d12343c56c8ccd1dc1e0d.url(args, options),
    method: 'post',
})

addMember210edebb545d12343c56c8ccd1dc1e0d.form = addMember210edebb545d12343c56c8ccd1dc1e0dForm

export const addMember = {
    '/api/user-groups/{group}/members': addMember160ae207d82edb4dc23eaa1b8e9bf391,
    '/api/groups/{group}/members': addMember210edebb545d12343c56c8ccd1dc1e0d,
}

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
const removeMemberae2df5c528ecef8c14b5a493addf88ab = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMemberae2df5c528ecef8c14b5a493addf88ab.url(args, options),
    method: 'delete',
})

removeMemberae2df5c528ecef8c14b5a493addf88ab.definition = {
    methods: ["delete"],
    url: '/api/user-groups/{group}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
removeMemberae2df5c528ecef8c14b5a493addf88ab.url = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
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

    return removeMemberae2df5c528ecef8c14b5a493addf88ab.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
removeMemberae2df5c528ecef8c14b5a493addf88ab.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMemberae2df5c528ecef8c14b5a493addf88ab.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/user-groups/{group}/members/{user}'
*/
const removeMemberae2df5c528ecef8c14b5a493addf88abForm = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMemberae2df5c528ecef8c14b5a493addf88ab.url(args, {
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
removeMemberae2df5c528ecef8c14b5a493addf88abForm.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMemberae2df5c528ecef8c14b5a493addf88ab.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMemberae2df5c528ecef8c14b5a493addf88ab.form = removeMemberae2df5c528ecef8c14b5a493addf88abForm
/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
const removeMember220e30d166a0e647bb1dd1b353b40be5 = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember220e30d166a0e647bb1dd1b353b40be5.url(args, options),
    method: 'delete',
})

removeMember220e30d166a0e647bb1dd1b353b40be5.definition = {
    methods: ["delete"],
    url: '/api/groups/{group}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
removeMember220e30d166a0e647bb1dd1b353b40be5.url = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
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

    return removeMember220e30d166a0e647bb1dd1b353b40be5.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
removeMember220e30d166a0e647bb1dd1b353b40be5.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember220e30d166a0e647bb1dd1b353b40be5.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::removeMember
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
const removeMember220e30d166a0e647bb1dd1b353b40be5Form = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember220e30d166a0e647bb1dd1b353b40be5.url(args, {
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
* @route '/api/groups/{group}/members/{user}'
*/
removeMember220e30d166a0e647bb1dd1b353b40be5Form.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember220e30d166a0e647bb1dd1b353b40be5.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMember220e30d166a0e647bb1dd1b353b40be5.form = removeMember220e30d166a0e647bb1dd1b353b40be5Form

export const removeMember = {
    '/api/user-groups/{group}/members/{user}': removeMemberae2df5c528ecef8c14b5a493addf88ab,
    '/api/groups/{group}/members/{user}': removeMember220e30d166a0e647bb1dd1b353b40be5,
}

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
const leaveGroup52e9c945d4508d9488af798abade52cf = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveGroup52e9c945d4508d9488af798abade52cf.url(args, options),
    method: 'post',
})

leaveGroup52e9c945d4508d9488af798abade52cf.definition = {
    methods: ["post"],
    url: '/api/user-groups/{group}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leaveGroup52e9c945d4508d9488af798abade52cf.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveGroup52e9c945d4508d9488af798abade52cf.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leaveGroup52e9c945d4508d9488af798abade52cf.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveGroup52e9c945d4508d9488af798abade52cf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
const leaveGroup52e9c945d4508d9488af798abade52cfForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveGroup52e9c945d4508d9488af798abade52cf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/user-groups/{group}/leave'
*/
leaveGroup52e9c945d4508d9488af798abade52cfForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveGroup52e9c945d4508d9488af798abade52cf.url(args, options),
    method: 'post',
})

leaveGroup52e9c945d4508d9488af798abade52cf.form = leaveGroup52e9c945d4508d9488af798abade52cfForm
/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
const leaveGroupc8e7f35faf4140b5b47fd44f77752ce9 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.url(args, options),
    method: 'post',
})

leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.definition = {
    methods: ["post"],
    url: '/api/groups/{group}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
const leaveGroupc8e7f35faf4140b5b47fd44f77752ce9Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::leaveGroup
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
leaveGroupc8e7f35faf4140b5b47fd44f77752ce9Form.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.url(args, options),
    method: 'post',
})

leaveGroupc8e7f35faf4140b5b47fd44f77752ce9.form = leaveGroupc8e7f35faf4140b5b47fd44f77752ce9Form

export const leaveGroup = {
    '/api/user-groups/{group}/leave': leaveGroup52e9c945d4508d9488af798abade52cf,
    '/api/groups/{group}/leave': leaveGroupc8e7f35faf4140b5b47fd44f77752ce9,
}

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
const leaveLogsbb8df6c80ed26a6247c39e661f594cda = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, options),
    method: 'get',
})

leaveLogsbb8df6c80ed26a6247c39e661f594cda.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/leave-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsbb8df6c80ed26a6247c39e661f594cda.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveLogsbb8df6c80ed26a6247c39e661f594cda.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsbb8df6c80ed26a6247c39e661f594cda.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsbb8df6c80ed26a6247c39e661f594cda.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
const leaveLogsbb8df6c80ed26a6247c39e661f594cdaForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsbb8df6c80ed26a6247c39e661f594cdaForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/user-groups/{group}/leave-logs'
*/
leaveLogsbb8df6c80ed26a6247c39e661f594cdaForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsbb8df6c80ed26a6247c39e661f594cda.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveLogsbb8df6c80ed26a6247c39e661f594cda.form = leaveLogsbb8df6c80ed26a6247c39e661f594cdaForm
/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
const leaveLogsc28113febe9fcd38d27a5ef3f57a0a74 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, options),
    method: 'get',
})

leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/leave-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
const leaveLogsc28113febe9fcd38d27a5ef3f57a0a74Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
leaveLogsc28113febe9fcd38d27a5ef3f57a0a74Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveLogs
* @see app/Http/Controllers/GroupController.php:429
* @route '/api/groups/{group}/leave-logs'
*/
leaveLogsc28113febe9fcd38d27a5ef3f57a0a74Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveLogsc28113febe9fcd38d27a5ef3f57a0a74.form = leaveLogsc28113febe9fcd38d27a5ef3f57a0a74Form

export const leaveLogs = {
    '/api/user-groups/{group}/leave-logs': leaveLogsbb8df6c80ed26a6247c39e661f594cda,
    '/api/groups/{group}/leave-logs': leaveLogsc28113febe9fcd38d27a5ef3f57a0a74,
}

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
const leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, options),
    method: 'get',
})

leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.definition = {
    methods: ["get","head"],
    url: '/api/user-groups/{group}/leave-reasons-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
const leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cbForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cbForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/user-groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cbForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb.form = leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cbForm
/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
const leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, options),
    method: 'get',
})

leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/leave-reasons-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
const leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::leaveReasonsSummary
* @see app/Http/Controllers/GroupController.php:459
* @route '/api/groups/{group}/leave-reasons-summary'
*/
leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1.form = leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1Form

export const leaveReasonsSummary = {
    '/api/user-groups/{group}/leave-reasons-summary': leaveReasonsSummaryf21bab57674e2a0e3b66fefafef180cb,
    '/api/groups/{group}/leave-reasons-summary': leaveReasonsSummaryf367b3f85d92b52704342cd366f699b1,
}

const GroupController = { index, store, show, update, destroy, search, manageable, statistics, requestJoin, joinRequests, reviewJoinRequest, myJoinRequests, addMember, removeMember, leaveGroup, leaveLogs, leaveReasonsSummary }

export default GroupController