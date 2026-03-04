import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
export const flaggedMessages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(options),
    method: 'get',
})

flaggedMessages.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/flags',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flaggedMessages.url = (options?: RouteQueryOptions) => {
    return flaggedMessages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flaggedMessages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flaggedMessages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: flaggedMessages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
const flaggedMessagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flaggedMessagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flaggedMessages
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flaggedMessagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

flaggedMessages.form = flaggedMessagesForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::reviewFlag
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
export const reviewFlag = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewFlag.url(args, options),
    method: 'post',
})

reviewFlag.definition = {
    methods: ["post"],
    url: '/admin/moderation/flags/{flag}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::reviewFlag
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
reviewFlag.url = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { flag: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { flag: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            flag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        flag: typeof args.flag === 'object'
        ? args.flag.id
        : args.flag,
    }

    return reviewFlag.definition.url
            .replace('{flag}', parsedArgs.flag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::reviewFlag
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
reviewFlag.post = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewFlag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::reviewFlag
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
const reviewFlagForm = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewFlag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::reviewFlag
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
reviewFlagForm.post = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reviewFlag.url(args, options),
    method: 'post',
})

reviewFlag.form = reviewFlagForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
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

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
export const automatedFiltering = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: automatedFiltering.url(options),
    method: 'get',
})

automatedFiltering.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/filtering',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
automatedFiltering.url = (options?: RouteQueryOptions) => {
    return automatedFiltering.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
automatedFiltering.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: automatedFiltering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
automatedFiltering.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: automatedFiltering.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
const automatedFilteringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: automatedFiltering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
automatedFilteringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: automatedFiltering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::automatedFiltering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
automatedFilteringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: automatedFiltering.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

automatedFiltering.form = automatedFilteringForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::updateFilteringSettings
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
export const updateFilteringSettings = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFilteringSettings.url(options),
    method: 'put',
})

updateFilteringSettings.definition = {
    methods: ["put"],
    url: '/admin/moderation/filtering',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::updateFilteringSettings
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
updateFilteringSettings.url = (options?: RouteQueryOptions) => {
    return updateFilteringSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::updateFilteringSettings
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
updateFilteringSettings.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFilteringSettings.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::updateFilteringSettings
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
const updateFilteringSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFilteringSettings.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::updateFilteringSettings
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
updateFilteringSettingsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFilteringSettings.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateFilteringSettings.form = updateFilteringSettingsForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flagMessage
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
export const flagMessage = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flagMessage.url(args, options),
    method: 'post',
})

flagMessage.definition = {
    methods: ["post"],
    url: '/messages/{message}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flagMessage
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
flagMessage.url = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return flagMessage.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flagMessage
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
flagMessage.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flagMessage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flagMessage
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
const flagMessageForm = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flagMessage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flagMessage
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/messages/{message}/flag'
*/
flagMessageForm.post = (args: { message: number | { id: number } } | [message: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flagMessage.url(args, options),
    method: 'post',
})

flagMessage.form = flagMessageForm

const ContentModerationController = { flaggedMessages, reviewFlag, statistics, automatedFiltering, updateFilteringSettings, flagMessage }

export default ContentModerationController