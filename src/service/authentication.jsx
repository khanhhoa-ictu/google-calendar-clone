import { sendPost } from './axios';

export const login = (payload) => sendPost('/login', payload);
export const signUp = (payload) =>  sendPost('/register', payload);
export const requestPassword = (email) => sendPost('/forgot/request', email);
export const verifyPassword = (otp) => sendPost('/forgot/verify', otp);
export const forgotPassWord = (newPassword) => sendPost('/forgot/password', newPassword);