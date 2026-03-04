import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AuthController::login
* @see app/Http/Controllers/Api/AuthController.php:19
* @route '/api/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::login
* @see app/Http/Controllers/Api/AuthController.php:19
* @route '/api/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::login
* @see app/Http/Controllers/Api/AuthController.php:19
* @route '/api/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::login
* @see app/Http/Controllers/Api/AuthController.php:19
* @route '/api/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::login
* @see app/Http/Controllers/Api/AuthController.php:19
* @route '/api/login'
*/
loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

login.form = loginForm

/**
* @see \App\Http\Controllers\Api\AuthController::registerGuardian
* @see app/Http/Controllers/Api/AuthController.php:44
* @route '/api/register/guardian'
*/
export const registerGuardian = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerGuardian.url(options),
    method: 'post',
})

registerGuardian.definition = {
    methods: ["post"],
    url: '/api/register/guardian',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::registerGuardian
* @see app/Http/Controllers/Api/AuthController.php:44
* @route '/api/register/guardian'
*/
registerGuardian.url = (options?: RouteQueryOptions) => {
    return registerGuardian.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::registerGuardian
* @see app/Http/Controllers/Api/AuthController.php:44
* @route '/api/register/guardian'
*/
registerGuardian.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerGuardian.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::registerGuardian
* @see app/Http/Controllers/Api/AuthController.php:44
* @route '/api/register/guardian'
*/
const registerGuardianForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerGuardian.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::registerGuardian
* @see app/Http/Controllers/Api/AuthController.php:44
* @route '/api/register/guardian'
*/
registerGuardianForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerGuardian.url(options),
    method: 'post',
})

registerGuardian.form = registerGuardianForm

/**
* @see \App\Http\Controllers\Api\AuthController::registerTherapist
* @see app/Http/Controllers/Api/AuthController.php:73
* @route '/api/register/therapist'
*/
export const registerTherapist = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerTherapist.url(options),
    method: 'post',
})

registerTherapist.definition = {
    methods: ["post"],
    url: '/api/register/therapist',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::registerTherapist
* @see app/Http/Controllers/Api/AuthController.php:73
* @route '/api/register/therapist'
*/
registerTherapist.url = (options?: RouteQueryOptions) => {
    return registerTherapist.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::registerTherapist
* @see app/Http/Controllers/Api/AuthController.php:73
* @route '/api/register/therapist'
*/
registerTherapist.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerTherapist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::registerTherapist
* @see app/Http/Controllers/Api/AuthController.php:73
* @route '/api/register/therapist'
*/
const registerTherapistForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerTherapist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::registerTherapist
* @see app/Http/Controllers/Api/AuthController.php:73
* @route '/api/register/therapist'
*/
registerTherapistForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerTherapist.url(options),
    method: 'post',
})

registerTherapist.form = registerTherapistForm

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/api/user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
const userForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
userForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\AuthController::user
* @see app/Http/Controllers/Api/AuthController.php:102
* @route '/api/user'
*/
userForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

user.form = userForm

/**
* @see \App\Http\Controllers\Api\AuthController::logout
* @see app/Http/Controllers/Api/AuthController.php:110
* @route '/api/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::logout
* @see app/Http/Controllers/Api/AuthController.php:110
* @route '/api/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::logout
* @see app/Http/Controllers/Api/AuthController.php:110
* @route '/api/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::logout
* @see app/Http/Controllers/Api/AuthController.php:110
* @route '/api/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AuthController::logout
* @see app/Http/Controllers/Api/AuthController.php:110
* @route '/api/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

const AuthController = { login, registerGuardian, registerTherapist, user, logout }

export default AuthController