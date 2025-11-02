import api from "../utils/axiosInstance";

export const fetchDocumentsApi = () =>
  api.get('/documents/list').then(res => res.data);

export const uploadDocumentApi = (formData, onUploadProgress) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onUploadProgress,  
  }).then(res => res.data);

export const deleteDocumentApi = (id) =>
  api.delete(`/documents/${id}`).then(res => res.data);


