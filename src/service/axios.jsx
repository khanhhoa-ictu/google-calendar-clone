import Axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = Axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_API_URL,
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
  Cookies.remove('refreshToken');
  window.location.href = "/";
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {  
    const originalConfig = error.config;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }
    return Axios.post(`${import.meta.env.VITE_API_URL}/refreshToken`, {
      refreshToken,
    })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;
          Cookies.set('token', data.token);
          originalConfig.headers.Authorization = `Bearer ${data.token}`;
          return Axios(originalConfig);
        } else {
          logout();
          return Promise.reject(error);
        }
      })
      .catch(() => {
        logout();
        return Promise.reject(error);
      });
  }
);

export const sendGet = (url, params) => axiosInstance.get(url, { params }).then((res) => res.data);
export const sendPost = (url, params, queryParams) =>
  axiosInstance.post(url, params, { params: queryParams }).then((res) => res.data);
export const sendPut = (url, params) => axiosInstance.put(url, params).then((res) => res.data);
export const sendPatch = (url, params) => axiosInstance.patch(url, params).then((res) => res.data);
export const sendDelete = (url, params) => axiosInstance.delete(url, { params }).then((res) => res.data);