import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VideoSessionController::createRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:26
* @route '/api/video-sessions/rooms'
*/
export const createRoom = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRoom.url(options),
    method: 'post',
})

createRoom.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::createRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:26
* @route '/api/video-sessions/rooms'
*/
createRoom.url = (options?: RouteQueryOptions) => {
    return createRoom.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::createRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:26
* @route '/api/video-sessions/rooms'
*/
createRoom.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRoom.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::createRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:26
* @route '/api/video-sessions/rooms'
*/
const createRoomForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRoom.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::createRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:26
* @route '/api/video-sessions/rooms'
*/
createRoomForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRoom.url(options),
    method: 'post',
})

createRoom.form = createRoomForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::joinRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:71
* @route '/api/video-sessions/rooms/{roomId}/join'
*/
export const joinRoom = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: joinRoom.url(args, options),
    method: 'post',
})

joinRoom.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/join',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::joinRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:71
* @route '/api/video-sessions/rooms/{roomId}/join'
*/
joinRoom.url = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomId: args }
    }

    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
    }

    return joinRoom.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::joinRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:71
* @route '/api/video-sessions/rooms/{roomId}/join'
*/
joinRoom.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: joinRoom.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::joinRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:71
* @route '/api/video-sessions/rooms/{roomId}/join'
*/
const joinRoomForm = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: joinRoom.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::joinRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:71
* @route '/api/video-sessions/rooms/{roomId}/join'
*/
joinRoomForm.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: joinRoom.url(args, options),
    method: 'post',
})

joinRoom.form = joinRoomForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::leaveRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:110
* @route '/api/video-sessions/rooms/{roomId}/leave'
*/
export const leaveRoom = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveRoom.url(args, options),
    method: 'post',
})

leaveRoom.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::leaveRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:110
* @route '/api/video-sessions/rooms/{roomId}/leave'
*/
leaveRoom.url = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomId: args }
    }

    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
    }

    return leaveRoom.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::leaveRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:110
* @route '/api/video-sessions/rooms/{roomId}/leave'
*/
leaveRoom.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leaveRoom.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::leaveRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:110
* @route '/api/video-sessions/rooms/{roomId}/leave'
*/
const leaveRoomForm = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveRoom.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::leaveRoom
* @see app/Http/Controllers/Api/VideoSessionController.php:110
* @route '/api/video-sessions/rooms/{roomId}/leave'
*/
leaveRoomForm.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leaveRoom.url(args, options),
    method: 'post',
})

leaveRoom.form = leaveRoomForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::endSession
* @see app/Http/Controllers/Api/VideoSessionController.php:130
* @route '/api/video-sessions/rooms/{roomId}/end'
*/
export const endSession = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: endSession.url(args, options),
    method: 'post',
})

endSession.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/end',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::endSession
* @see app/Http/Controllers/Api/VideoSessionController.php:130
* @route '/api/video-sessions/rooms/{roomId}/end'
*/
endSession.url = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomId: args }
    }

    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
    }

    return endSession.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::endSession
* @see app/Http/Controllers/Api/VideoSessionController.php:130
* @route '/api/video-sessions/rooms/{roomId}/end'
*/
endSession.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: endSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::endSession
* @see app/Http/Controllers/Api/VideoSessionController.php:130
* @route '/api/video-sessions/rooms/{roomId}/end'
*/
const endSessionForm = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: endSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::endSession
* @see app/Http/Controllers/Api/VideoSessionController.php:130
* @route '/api/video-sessions/rooms/{roomId}/end'
*/
endSessionForm.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: endSession.url(args, options),
    method: 'post',
})

endSession.form = endSessionForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::updateParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:168
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}'
*/
export const updateParticipant = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateParticipant.url(args, options),
    method: 'patch',
})

updateParticipant.definition = {
    methods: ["patch"],
    url: '/api/video-sessions/rooms/{roomId}/participants/{participantId}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::updateParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:168
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}'
*/
updateParticipant.url = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
            participantId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
        participantId: args.participantId,
    }

    return updateParticipant.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::updateParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:168
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}'
*/
updateParticipant.patch = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateParticipant.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::updateParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:168
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}'
*/
const updateParticipantForm = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::updateParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:168
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}'
*/
updateParticipantForm.patch = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateParticipant.form = updateParticipantForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::muteParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:207
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute'
*/
export const muteParticipant = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: muteParticipant.url(args, options),
    method: 'post',
})

muteParticipant.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::muteParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:207
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute'
*/
muteParticipant.url = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
            participantId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
        participantId: args.participantId,
    }

    return muteParticipant.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::muteParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:207
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute'
*/
muteParticipant.post = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: muteParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::muteParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:207
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute'
*/
const muteParticipantForm = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: muteParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::muteParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:207
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/mute'
*/
muteParticipantForm.post = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: muteParticipant.url(args, options),
    method: 'post',
})

muteParticipant.form = muteParticipantForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::kickParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:244
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick'
*/
export const kickParticipant = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kickParticipant.url(args, options),
    method: 'post',
})

kickParticipant.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::kickParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:244
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick'
*/
kickParticipant.url = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
            participantId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
        participantId: args.participantId,
    }

    return kickParticipant.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::kickParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:244
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick'
*/
kickParticipant.post = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: kickParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::kickParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:244
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick'
*/
const kickParticipantForm = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: kickParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::kickParticipant
* @see app/Http/Controllers/Api/VideoSessionController.php:244
* @route '/api/video-sessions/rooms/{roomId}/participants/{participantId}/kick'
*/
kickParticipantForm.post = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: kickParticipant.url(args, options),
    method: 'post',
})

kickParticipant.form = kickParticipantForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::startRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:281
* @route '/api/video-sessions/rooms/{roomId}/recording/start'
*/
export const startRecording = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startRecording.url(args, options),
    method: 'post',
})

startRecording.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/recording/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::startRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:281
* @route '/api/video-sessions/rooms/{roomId}/recording/start'
*/
startRecording.url = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomId: args }
    }

    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
    }

    return startRecording.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::startRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:281
* @route '/api/video-sessions/rooms/{roomId}/recording/start'
*/
startRecording.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startRecording.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::startRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:281
* @route '/api/video-sessions/rooms/{roomId}/recording/start'
*/
const startRecordingForm = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: startRecording.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::startRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:281
* @route '/api/video-sessions/rooms/{roomId}/recording/start'
*/
startRecordingForm.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: startRecording.url(args, options),
    method: 'post',
})

startRecording.form = startRecordingForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::stopRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:301
* @route '/api/video-sessions/rooms/{roomId}/recording/stop'
*/
export const stopRecording = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopRecording.url(args, options),
    method: 'post',
})

stopRecording.definition = {
    methods: ["post"],
    url: '/api/video-sessions/rooms/{roomId}/recording/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::stopRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:301
* @route '/api/video-sessions/rooms/{roomId}/recording/stop'
*/
stopRecording.url = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomId: args }
    }

    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
    }

    return stopRecording.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::stopRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:301
* @route '/api/video-sessions/rooms/{roomId}/recording/stop'
*/
stopRecording.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopRecording.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::stopRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:301
* @route '/api/video-sessions/rooms/{roomId}/recording/stop'
*/
const stopRecordingForm = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopRecording.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::stopRecording
* @see app/Http/Controllers/Api/VideoSessionController.php:301
* @route '/api/video-sessions/rooms/{roomId}/recording/stop'
*/
stopRecordingForm.post = (args: { roomId: string | number } | [roomId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopRecording.url(args, options),
    method: 'post',
})

stopRecording.form = stopRecordingForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
export const getParticipantRooms = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getParticipantRooms.url(args, options),
    method: 'get',
})

getParticipantRooms.definition = {
    methods: ["get","head"],
    url: '/api/video-sessions/participants/{participantId}/rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
getParticipantRooms.url = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { participantId: args }
    }

    if (Array.isArray(args)) {
        args = {
            participantId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        participantId: args.participantId,
    }

    return getParticipantRooms.definition.url
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
getParticipantRooms.get = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getParticipantRooms.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
getParticipantRooms.head = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getParticipantRooms.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
const getParticipantRoomsForm = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipantRooms.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
getParticipantRoomsForm.get = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipantRooms.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getParticipantRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:322
* @route '/api/video-sessions/participants/{participantId}/rooms'
*/
getParticipantRoomsForm.head = (args: { participantId: string | number } | [participantId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipantRooms.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getParticipantRooms.form = getParticipantRoomsForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
export const getActiveRooms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getActiveRooms.url(options),
    method: 'get',
})

getActiveRooms.definition = {
    methods: ["get","head"],
    url: '/api/video-sessions/rooms/active',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
getActiveRooms.url = (options?: RouteQueryOptions) => {
    return getActiveRooms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
getActiveRooms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getActiveRooms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
getActiveRooms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getActiveRooms.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
const getActiveRoomsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getActiveRooms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
getActiveRoomsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getActiveRooms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::getActiveRooms
* @see app/Http/Controllers/Api/VideoSessionController.php:344
* @route '/api/video-sessions/rooms/active'
*/
getActiveRoomsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getActiveRooms.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getActiveRooms.form = getActiveRoomsForm

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
export const validateRoomAccess = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validateRoomAccess.url(args, options),
    method: 'get',
})

validateRoomAccess.definition = {
    methods: ["get","head"],
    url: '/api/video-sessions/rooms/{roomId}/access/{participantId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
validateRoomAccess.url = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            roomId: args[0],
            participantId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        roomId: args.roomId,
        participantId: args.participantId,
    }

    return validateRoomAccess.definition.url
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace('{participantId}', parsedArgs.participantId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
validateRoomAccess.get = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validateRoomAccess.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
validateRoomAccess.head = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: validateRoomAccess.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
const validateRoomAccessForm = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: validateRoomAccess.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
validateRoomAccessForm.get = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: validateRoomAccess.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\VideoSessionController::validateRoomAccess
* @see app/Http/Controllers/Api/VideoSessionController.php:364
* @route '/api/video-sessions/rooms/{roomId}/access/{participantId}'
*/
validateRoomAccessForm.head = (args: { roomId: string | number, participantId: string | number } | [roomId: string | number, participantId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: validateRoomAccess.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

validateRoomAccess.form = validateRoomAccessForm

const VideoSessionController = { createRoom, joinRoom, leaveRoom, endSession, updateParticipant, muteParticipant, kickParticipant, startRecording, stopRecording, getParticipantRooms, getActiveRooms, validateRoomAccess }

export default VideoSessionController