import fs from "fs"
import path from "path"

type UserId = string

export interface StoredUser {
	id: UserId
	email: string
	passwordHash: string
	createdAt: string
	rooms: string[]
}

interface DatabaseSchema {
	users: StoredUser[]
}

const dataDirectory = path.join(process.cwd(), "data")
const databaseFilePath = path.join(dataDirectory, "db.json")

function ensureDataFile(): void {
	if (!fs.existsSync(dataDirectory)) {
		fs.mkdirSync(dataDirectory, { recursive: true })
	}
	if (!fs.existsSync(databaseFilePath)) {
		const initial: DatabaseSchema = { users: [] }
		fs.writeFileSync(databaseFilePath, JSON.stringify(initial, null, 2), "utf-8")
	}
}

function readDatabase(): DatabaseSchema {
	ensureDataFile()
	const raw = fs.readFileSync(databaseFilePath, "utf-8")
	try {
		const parsed = JSON.parse(raw) as DatabaseSchema
		if (!parsed.users) parsed.users = []
		return parsed
	} catch {
		return { users: [] }
	}
}

function writeDatabase(db: DatabaseSchema): void {
	ensureDataFile()
	fs.writeFileSync(databaseFilePath, JSON.stringify(db, null, 2), "utf-8")
}

export function findUserByEmail(email: string): StoredUser | undefined {
	const db = readDatabase()
	return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: UserId): StoredUser | undefined {
	const db = readDatabase()
	return db.users.find((u) => u.id === id)
}

export function createUser(user: StoredUser): StoredUser {
	const db = readDatabase()
	db.users.push(user)
	writeDatabase(db)
	return user
}

export function addRoomToUser(userId: UserId, roomId: string): StoredUser | null {
	const db = readDatabase()
	const userIndex = db.users.findIndex((u) => u.id === userId)
	if (userIndex === -1) return null
	const user = db.users[userIndex]
	if (!user.rooms.includes(roomId)) {
		user.rooms.push(roomId)
		writeDatabase(db)
	}
	return user
}

export function getUserRooms(userId: UserId): string[] {
	const db = readDatabase()
	const user = db.users.find((u) => u.id === userId)
	return user ? user.rooms : []
}

