import { FormEvent, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"

export default function SignupPage() {
	const { register } = useAuth()
	const navigate = useNavigate()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			await register(email, password)
			toast.success("Account created")
			navigate("/")
		} catch (err: unknown) {
			toast.error("Signup failed")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
				<h1 className="text-2xl font-semibold">Create account</h1>
				<input
					type="email"
					placeholder="Email"
					className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="submit"
					disabled={loading}
					className="mt-2 w-full rounded-md bg-primary px-8 py-3 text-lg font-semibold text-black disabled:opacity-60"
				>
					{loading ? "Creating..." : "Sign up"}
				</button>
				<p className="text-sm text-gray-400">
					Have an account? <Link className="underline" to="/login">Login</Link>
				</p>
			</form>
		</div>
	)
}

