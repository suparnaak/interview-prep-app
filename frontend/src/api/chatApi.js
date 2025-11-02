import api from "../utils/axiosInstance";

export const startChatApi = () =>
  api.post('/chat/start').then(res => res.data);

export const sendMessageApi = (sessionId, message) =>
  api.post('/chat/query', { sessionId, message }).then(res => res.data);