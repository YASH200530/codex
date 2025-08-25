import backendApi from "@/api/backendApi"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface AuthUser {
	id: string
	email: string
}

interface AuthContextType {
	user: AuthUser | null
	token: string | null
	login: (email: string, password: string) => Promise<void>
	register: (email: string, password: string) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used within AuthProvider")
	return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(
		() => localStorage.getItem("token")
	)
	const [user, setUser] = useState<AuthUser | null>(() => {
		const raw = localStorage.getItem("auth_user")
		return raw ? (JSON.parse(raw) as AuthUser) : null
	})

	useEffect(() => {
		if (token) localStorage.setItem("token", token)
		else localStorage.removeItem("token")
	}, [token])

	useEffect(() => {
		if (user) localStorage.setItem("auth_user", JSON.stringify(user))
		else localStorage.removeItem("auth_user")
	}, [user])

	async function register(email: string, password: string) {
		const res = await backendApi.post("/auth/register", { email, password })
		setToken(res.data.token)
		setUser(res.data.user)
	}

	async function login(email: string, password: string) {
		const res = await backendApi.post("/auth/login", { email, password })
		setToken(res.data.token)
		setUser(res.data.user)
	}

	function logout() {
		setToken(null)
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, token, register, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext

