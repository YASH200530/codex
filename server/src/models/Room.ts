import mongoose, { Schema } from "mongoose"

const WorkspaceSchema = new Schema(
	{
		fileStructure: { type: Schema.Types.Mixed, required: false },
		drawingData: { type: Schema.Types.Mixed, required: false },
	},
	{ _id: false }
)

const RoomSchema = new Schema(
	{
		roomId: { type: String, required: true, unique: true, index: true },
		workspace: { type: WorkspaceSchema, required: true, default: {} },
	},
	{ timestamps: true }
)

export const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema)

