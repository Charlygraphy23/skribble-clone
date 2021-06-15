/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import {
	joinRoom,
	kiskUserOutFromRoom,
	messageSend,
	sendAllUserDataToRoom,
} from "./Handlers.js";
export default (io) => {
	io.on("connection", (socket) => {
		let roomName = socket.handshake.query.room;
		let username = socket.handshake.query.username;
		joinRoom({ io, socket, username, roomName });

		// remove users on that room
		socket.on("disconnect", () => {
			kiskUserOutFromRoom({ io, socket });
		});

		socket.on("message-send", ({ userName, room, message }) => {
			messageSend({ userName, room, message, io, socket });
		});

		socket.on("getAllUsers", (room, cb) => {
			sendAllUserDataToRoom({ io, socket, room, cb });
		});

		socket.on("start-drawing-trigger", ({ room, x, y }) => {
			let __tempObj = { x, y };
			socket.broadcast.to(room).emit("start-drawing-listner", __tempObj);
		});

		socket.on("stop-drawing-trigger", ({ room }) => {
			socket.broadcast.to(room).emit("stop-drawing-listner");
		});

		socket.on("drawing-trigger", ({ room, x, y }) => {
			let __tempObj = { x, y };
			socket.broadcast.to(room).emit("drawing-listner", __tempObj);
		});

		socket.on("change-color", (color, room) => {
			console.log("kk", room);
			socket.broadcast.to(room).emit("set-color", color);
		});
	});
};
