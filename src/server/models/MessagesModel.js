import mongoose from "mongoose";

const messagesModel = new mongoose.Schema(
	{
		userName: {
			type: String,
			default: "",
		},
		message: {
			type: String,
			default: "",
		},
		guessed: {
			type: Boolean,
			default: false,
		},
		room: {
			type: String,
			default: "",
		},

		broadCastMessage: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("messages", messagesModel);
