import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const profile = () => sendGet('/user/profile');
export const listUser = () => sendGet('/manager/user');
export const addUser = (user) => sendPost('/manager/add-user',user);
export const deleteUser = (id) => sendDelete(`/manager/delete-user/${id}`);
export const getUserDetail = (id) => sendGet(`/manager/detail-user/${id}`);
export const updateUser = (params) => sendPut(`/manager/update-user`,params);


