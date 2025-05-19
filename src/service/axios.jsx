import Axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = Axios.create({
  timeout: 100000,
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const logout = () => {
  Cookies.remove('token');
  localStorage.clear();
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async(error) => {  
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }else{
      logout();
      return Promise.reject(error);
    }
  }
);

export const sendGet = (url, params) => axiosInstance.get(url, { params }).then((res) => res.data);
export const sendPost = (url, params, queryParams) =>
  axiosInstance.post(url, params, { params: queryParams }).then((res) => res.data);
export const sendPut = (url, params) => axiosInstance.put(url, params).then((res) => res.data);
export const sendPatch = (url, params) => axiosInstance.patch(url, params).then((res) => res.data);
export const sendDelete = (url, params) => axiosInstance.delete(url, { params }).then((res) => res.data);