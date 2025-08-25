import { Router, Response } from "express"
import { addRoomToUser, getUserRooms } from "./storage"
import { AuthenticatedRequest, authenticate } from "./middleware"

const router = Router()

router.get("/me/rooms", authenticate, (req: AuthenticatedRequest, res: Response) => {
	const userId = req.userId as string
	const rooms = getUserRooms(userId)
	return res.json({ rooms })
})

router.post("/me/rooms", authenticate, (req: AuthenticatedRequest, res: Response) => {
	const userId = req.userId as string
	const { roomId } = req.body as { roomId?: string }
	if (!roomId) return res.status(400).json({ message: "roomId required" })
	const user = addRoomToUser(userId, roomId)
	if (!user) return res.status(404).json({ message: "User not found" })
	return res.status(201).json({ rooms: user.rooms })
})

export default router

