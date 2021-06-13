import mongoose from "mongoose";

let rommSchema = new mongoose.Schema(
	{
		roomName: {
			type: String,
			default: "",
		},

		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("rooms", rommSchema);
