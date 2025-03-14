import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const addEvent = (params) => sendPost('/event/add-event', params);

export const getListCalendar = (userId) =>sendGet(`/event/${userId}`)

export const updateEvent = (params) => sendPut(`/event/update-event`, params)

export const deleteEvent = (eventId) => sendDelete(`/event/delete-event/${eventId}`)

export const getDetailEvent = (id) =>sendGet(`/recurring-events/${id}`)

export const deleteRecurringEvent = (eventId) => sendDelete(`/recurring-events/${eventId}`)

export const updateRecurringEvent = (eventId, params) => sendPut(`/recurring-events/${eventId}`, params)



