import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
	userId?: string
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export function authenticate(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Missing authorization header" })
	}
	const token = authHeader.substring("Bearer ".length)
	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
		req.userId = payload.userId
		next()
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" })
	}
}

export function signToken(userId: string): string {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" })
}

