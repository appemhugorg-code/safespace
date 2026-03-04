import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:17
* @route '/settings/profile'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:25
* @route '/settings/profile'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:25
* @route '/settings/profile'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:25
* @route '/settings/profile'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:25
* @route '/settings/profile'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:25
* @route '/settings/profile'
*/
updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:139
* @route '/settings/profile'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:139
* @route '/settings/profile'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:139
* @route '/settings/profile'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:139
* @route '/settings/profile'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:139
* @route '/settings/profile'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Settings\ProfileController::sendPhoneVerification
* @see app/Http/Controllers/Settings/ProfileController.php:93
* @route '/settings/profile/send-phone-verification'
*/
export const sendPhoneVerification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPhoneVerification.url(options),
    method: 'post',
})

sendPhoneVerification.definition = {
    methods: ["post"],
    url: '/settings/profile/send-phone-verification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::sendPhoneVerification
* @see app/Http/Controllers/Settings/ProfileController.php:93
* @route '/settings/profile/send-phone-verification'
*/
sendPhoneVerification.url = (options?: RouteQueryOptions) => {
    return sendPhoneVerification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::sendPhoneVerification
* @see app/Http/Controllers/Settings/ProfileController.php:93
* @route '/settings/profile/send-phone-verification'
*/
sendPhoneVerification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPhoneVerification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::sendPhoneVerification
* @see app/Http/Controllers/Settings/ProfileController.php:93
* @route '/settings/profile/send-phone-verification'
*/
const sendPhoneVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendPhoneVerification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::sendPhoneVerification
* @see app/Http/Controllers/Settings/ProfileController.php:93
* @route '/settings/profile/send-phone-verification'
*/
sendPhoneVerificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendPhoneVerification.url(options),
    method: 'post',
})

sendPhoneVerification.form = sendPhoneVerificationForm

/**
* @see \App\Http\Controllers\Settings\ProfileController::verifyPhone
* @see app/Http/Controllers/Settings/ProfileController.php:113
* @route '/settings/profile/verify-phone'
*/
export const verifyPhone = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPhone.url(options),
    method: 'post',
})

verifyPhone.definition = {
    methods: ["post"],
    url: '/settings/profile/verify-phone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::verifyPhone
* @see app/Http/Controllers/Settings/ProfileController.php:113
* @route '/settings/profile/verify-phone'
*/
verifyPhone.url = (options?: RouteQueryOptions) => {
    return verifyPhone.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::verifyPhone
* @see app/Http/Controllers/Settings/ProfileController.php:113
* @route '/settings/profile/verify-phone'
*/
verifyPhone.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPhone.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::verifyPhone
* @see app/Http/Controllers/Settings/ProfileController.php:113
* @route '/settings/profile/verify-phone'
*/
const verifyPhoneForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyPhone.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::verifyPhone
* @see app/Http/Controllers/Settings/ProfileController.php:113
* @route '/settings/profile/verify-phone'
*/
verifyPhoneForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyPhone.url(options),
    method: 'post',
})

verifyPhone.form = verifyPhoneForm

const profile = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    sendPhoneVerification: Object.assign(sendPhoneVerification, sendPhoneVerification),
    verifyPhone: Object.assign(verifyPhone, verifyPhone),
}

export default profile