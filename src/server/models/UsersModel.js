import mongoose from "mongoose";

let usersSchema = new mongoose.Schema(
	{
		userName: {
			type: String,

			required: true,
		},
		socketId: {
			type: String,

			required: true,
		},
		roomId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "rooms",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("users", usersSchema);
