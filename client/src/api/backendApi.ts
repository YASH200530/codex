import axios, { AxiosInstance } from "axios"

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const backendApi: AxiosInstance = axios.create({
	baseURL: `${baseURL}/api`,
})

backendApi.interceptors.request.use((config) => {
	const token = localStorage.getItem("token")
	if (token) {
		config.headers = config.headers || {}
		config.headers["Authorization"] = `Bearer ${token}`
	}
	return config
})

export default backendApi

