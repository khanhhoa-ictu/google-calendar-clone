import { sendGet, sendPost } from "./axios";

export const createPoll = (data) =>sendPost(`/meeting-poll/create`, data)

export const detailPoll = (pollId) =>sendGet(`/meeting-poll/${pollId}`)

