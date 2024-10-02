import axios from 'axios'

const recipesApi = axios.create({
  baseURL: import.meta.env.VITE_RECIPES_API_URL
})

//! Interceptors
recipesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export { recipesApi }
