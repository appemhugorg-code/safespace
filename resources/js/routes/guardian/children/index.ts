import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guardian/children',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::index
* @see app/Http/Controllers/Guardian/ChildManagementController.php:21
* @route '/guardian/children'
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
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/guardian/children/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::create
* @see app/Http/Controllers/Guardian/ChildManagementController.php:38
* @route '/guardian/children/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::store
* @see app/Http/Controllers/Guardian/ChildManagementController.php:46
* @route '/guardian/children'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/guardian/children',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::store
* @see app/Http/Controllers/Guardian/ChildManagementController.php:46
* @route '/guardian/children'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::store
* @see app/Http/Controllers/Guardian/ChildManagementController.php:46
* @route '/guardian/children'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::store
* @see app/Http/Controllers/Guardian/ChildManagementController.php:46
* @route '/guardian/children'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::store
* @see app/Http/Controllers/Guardian/ChildManagementController.php:46
* @route '/guardian/children'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
export const show = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/guardian/children/{child}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
show.url = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { child: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: typeof args.child === 'object'
        ? args.child.id
        : args.child,
    }

    return show.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
show.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
show.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
const showForm = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
showForm.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::show
* @see app/Http/Controllers/Guardian/ChildManagementController.php:95
* @route '/guardian/children/{child}'
*/
showForm.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
export const edit = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/guardian/children/{child}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
edit.url = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { child: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: typeof args.child === 'object'
        ? args.child.id
        : args.child,
    }

    return edit.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
edit.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
edit.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
const editForm = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
editForm.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::edit
* @see app/Http/Controllers/Guardian/ChildManagementController.php:161
* @route '/guardian/children/{child}/edit'
*/
editForm.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
export const update = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/guardian/children/{child}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
update.url = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { child: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: typeof args.child === 'object'
        ? args.child.id
        : args.child,
    }

    return update.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
update.put = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
update.patch = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
const updateForm = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
updateForm.put = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::update
* @see app/Http/Controllers/Guardian/ChildManagementController.php:176
* @route '/guardian/children/{child}'
*/
updateForm.patch = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Guardian\ChildManagementController::destroy
* @see app/Http/Controllers/Guardian/ChildManagementController.php:0
* @route '/guardian/children/{child}'
*/
export const destroy = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/guardian/children/{child}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::destroy
* @see app/Http/Controllers/Guardian/ChildManagementController.php:0
* @route '/guardian/children/{child}'
*/
destroy.url = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: args.child,
    }

    return destroy.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::destroy
* @see app/Http/Controllers/Guardian/ChildManagementController.php:0
* @route '/guardian/children/{child}'
*/
destroy.delete = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::destroy
* @see app/Http/Controllers/Guardian/ChildManagementController.php:0
* @route '/guardian/children/{child}'
*/
const destroyForm = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::destroy
* @see app/Http/Controllers/Guardian/ChildManagementController.php:0
* @route '/guardian/children/{child}'
*/
destroyForm.delete = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
export const progress = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

progress.definition = {
    methods: ["get","head"],
    url: '/guardian/children/{child}/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
progress.url = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { child: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: typeof args.child === 'object'
        ? args.child.id
        : args.child,
    }

    return progress.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
progress.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
progress.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progress.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
const progressForm = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
progressForm.get = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ChildManagementController::progress
* @see app/Http/Controllers/Guardian/ChildManagementController.php:218
* @route '/guardian/children/{child}/progress'
*/
progressForm.head = (args: { child: number | { id: number } } | [child: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

progress.form = progressForm

const children = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    progress: Object.assign(progress, progress),
}

export default children