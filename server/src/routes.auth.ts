import { Router, Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { createUser, findUserByEmail } from "./storage"
import { signToken } from "./middleware"

const router = Router()

router.post("/register", async (req: Request, res: Response) => {
	const { email, password } = req.body as { email?: string; password?: string }
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" })
	}
	const existing = findUserByEmail(email)
	if (existing) {
		return res.status(409).json({ message: "Email already in use" })
	}
	const passwordHash = await bcrypt.hash(password, 10)
	const user = createUser({
		id: uuidv4(),
		email,
		passwordHash,
		createdAt: new Date().toISOString(),
		rooms: [],
	})
	const token = signToken(user.id)
	return res.status(201).json({ token, user: { id: user.id, email: user.email } })
})

router.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body as { email?: string; password?: string }
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" })
	}
	const user = findUserByEmail(email)
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" })
	}
	const ok = await bcrypt.compare(password, user.passwordHash)
	if (!ok) {
		return res.status(401).json({ message: "Invalid credentials" })
	}
	const token = signToken(user.id)
	return res.json({ token, user: { id: user.id, email: user.email } })
})

export default router

