/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import {
	joinRoom,
	kiskUserOutFromRoom,
	messageSend,
	sendAllUserDataToRoom,
	handleStartGame,
	handleUserScore,
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
			socket.broadcast.to(room).emit("set-color", color);
		});

		socket.on("change-brush", (brushType, room) => {
			socket.broadcast.to(room).emit("set-brush", brushType);
		});

		socket.on("clear-all", (clearAll, room) => {
			socket.broadcast.to(room).emit("set-clear-all", clearAll);
		});
		socket.on("brush-size", (size, room) => {
			socket.broadcast.to(room).emit("set-brush-size", size);
		});
		socket.on("start-game", (room, rounds, time) => {
			handleStartGame(room, rounds, socket, io, time);
		});

		socket.on("guessed_word", ({ id, room }) => {
			handleUserScore(id, room, socket, io);
		});
	});
};
