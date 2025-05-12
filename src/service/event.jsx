import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const addEvent = (params) => sendPost('/event/add-event', params);

export const getListCalendar = (userId) =>sendGet(`/event/${userId}`)

export const updateEvent = (params) => sendPut(`/event/update-event`, params)

export const deleteEvent = (params) => sendDelete(`/event/delete-event/${params?.eventId}/${params?.accessToken}`)

export const getDetailEvent = (id) =>sendGet(`/recurring-events/${id}`)

export const deleteRecurringEvent = (params) => sendDelete(`/recurring-events/${params?.eventId}/${params?.accessToken}`)

export const updateRecurringEvent = (eventId, params) => sendPut(`/recurring-events/${eventId}`, params)

export const getTokenByGoogleCalendar = (params) =>sendPost(`/google/callback`, params)

export const syncGoogleCalendar = (params) =>sendPost(`/google/sync-calendar`, params)

export const checkSyncToGoogle = (userId) =>sendGet(`/google/sync-calendar/check/${userId}`)

export const handleRefreshTokenGoogle = (userId) =>sendGet(`/google/auth/refresh-token/${userId}`)

export const registerWebhook = (accessToken, email) =>sendPost("/google/register-webhook",{accessToken, email})

export const changeStatusEventShare = (data) => sendPost("/event/respond", data)

export const changeStatusEventShareRecurring = (data) => sendPost("/event/respond/recurring", data)


export const changeStatusRecurringEventShare = (data) => sendPost("/recurring/event/respond", data)

export const updateRecurringFromEvent = (recurringId, params) =>sendPut(`/recurring-events/update-from-current/${recurringId}`, params)






