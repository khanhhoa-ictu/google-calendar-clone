import { sendGet, sendPost } from "./axios";

export const createPoll = (data) =>sendPost(`/meeting-poll/create`, data)

export const detailPoll = (pollId) =>sendGet(`/meeting-poll/${pollId}`)

export const votePoll = (data, pollId) =>sendPost(`/meeting-poll/${pollId}/vote`, data)

export const finalizePoll = (data) =>sendPost("/meeting-poll/finalize",data)

export const updateMeetingPoll = (data) =>sendPost("/meeting-poll/update", data)