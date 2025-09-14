import axios from "axios"

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

export async function createRoom(roomId: string) {
	return axios.post(`${BASE_URL}/api/rooms`, { roomId }).then((r) => r.data)
}

export async function getWorkspace(roomId: string) {
	return axios
		.get(`${BASE_URL}/api/rooms/${encodeURIComponent(roomId)}/workspace`)
		.then((r) => r.data)
}

export async function saveWorkspace(
	roomId: string,
	workspace: { fileStructure?: unknown; drawingData?: unknown }
) {
	return axios
		.put(
			`${BASE_URL}/api/rooms/${encodeURIComponent(roomId)}/workspace`,
			workspace
		)
		.then((r) => r.data)
}

