import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mood',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
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
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mood',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/mood/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

history.form = historyForm

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
export const childMoodData = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childMoodData.url(args, options),
    method: 'get',
})

childMoodData.definition = {
    methods: ["get","head"],
    url: '/child/{child}/mood',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
childMoodData.url = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return childMoodData.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
childMoodData.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
childMoodData.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: childMoodData.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
const childMoodDataForm = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
childMoodDataForm.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::childMoodData
* @see app/Http/Controllers/MoodLogController.php:113
* @route '/child/{child}/mood'
*/
childMoodDataForm.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childMoodData.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

childMoodData.form = childMoodDataForm

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
export const guardianOverview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardianOverview.url(options),
    method: 'get',
})

guardianOverview.definition = {
    methods: ["get","head"],
    url: '/mood/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
guardianOverview.url = (options?: RouteQueryOptions) => {
    return guardianOverview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
guardianOverview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardianOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
guardianOverview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guardianOverview.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
const guardianOverviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
guardianOverviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::guardianOverview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
guardianOverviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianOverview.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

guardianOverview.form = guardianOverviewForm

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
export const therapistOverview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistOverview.url(options),
    method: 'get',
})

therapistOverview.definition = {
    methods: ["get","head"],
    url: '/mood/therapist-overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
therapistOverview.url = (options?: RouteQueryOptions) => {
    return therapistOverview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
therapistOverview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
therapistOverview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: therapistOverview.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
const therapistOverviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
therapistOverviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistOverview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistOverview
* @see app/Http/Controllers/MoodLogController.php:224
* @route '/mood/therapist-overview'
*/
therapistOverviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistOverview.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

therapistOverview.form = therapistOverviewForm

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
export const therapistChildMoodData = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistChildMoodData.url(args, options),
    method: 'get',
})

therapistChildMoodData.definition = {
    methods: ["get","head"],
    url: '/therapist/child/{child}/mood',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
therapistChildMoodData.url = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return therapistChildMoodData.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
therapistChildMoodData.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistChildMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
therapistChildMoodData.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: therapistChildMoodData.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
const therapistChildMoodDataForm = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistChildMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
therapistChildMoodDataForm.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistChildMoodData.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::therapistChildMoodData
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
therapistChildMoodDataForm.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistChildMoodData.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

therapistChildMoodData.form = therapistChildMoodDataForm

const MoodLogController = { index, store, history, childMoodData, guardianOverview, therapistOverview, therapistChildMoodData }

export default MoodLogController