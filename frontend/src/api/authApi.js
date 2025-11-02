import api from "../utils/axiosInstance";

export const loginApi = (credentials) =>
  api.post('/auth/login', credentials).then(res => res.data);

export const signupApi = (payload) =>
  api.post('/auth/signup', payload).then(res => res.data);

