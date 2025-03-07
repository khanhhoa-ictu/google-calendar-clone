import { sendGet } from "./axios";

export const profile = () => sendGet('/user/profile');
