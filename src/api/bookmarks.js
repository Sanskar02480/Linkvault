import axios from 'axios'
import { getUserId } from '../utils/userId'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:10000/api'
})

API.interceptors.request.use((config) => {
  const userId = getUserId()
  if (config.method === 'get' || config.method === 'delete') {
    config.params = { ...config.params, userId }
  }
  return config
})

export const getAllBookmarks = () => API.get('/bookmarks')

export const saveBookmark = (data) => API.post('/bookmarks', { ...data, userId: getUserId() })

export const searchBookmarks = (query) => API.get(`/bookmarks/search?q=${query}`)

export const vectorSearch = (query) => API.get(`/bookmarks/vector-search?q=${query}`)

export const deleteBookmark = (id) => API.delete(`/bookmarks/${id}`)