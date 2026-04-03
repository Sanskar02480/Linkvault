import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const getAllBookmarks = () => API.get('/bookmarks')

export const saveBookmark = (data) => API.post('/bookmarks', data)

export const searchBookmarks =(query) => API.get(`/bookmarks/search?q=${query}`)

export const vectorSearch = (query) => API.get(`/bookmarks/vector-search?q=${query}`)

export const deleteBookmark = (id) => API.delete(`/bookmarks/${id}`)