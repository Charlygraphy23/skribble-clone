import mongoose from "mongoose";
import { Server } from "socket.io";
import socketIoRunner from "../controllers/SocketIoController.js";

const MONGO_URI =
	"mongodb+srv://skribbleAdmin:Vi97sSvXe3XEn17I@skribblecluster.xvjqx.mongodb.net/skribbleDb?retryWrites=true&w=majority";

export const connectMongo = async () => {
	return await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
};

// creating socket io server
export const createSocketServer = (server) => {
	const ioInstance = new Server(server, {
		cors: {
			origin: "*",
		},
	});
	socketIoRunner(ioInstance);
};
