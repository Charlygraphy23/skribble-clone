/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import MessagesCollection from "../models/MessagesModel.js";

export default (io) => {
	io.on("connection", (socket) => {
		let roomName = socket.handshake.query.room;
		let username = socket.handshake.query.username;
		joinAUserInARoom({ io, socket, username, roomName });

		// empty room
		socket.on("disconnect", (room) => {
			kickClientFromRoom({ io, socket, room });
		});

		socket.on("message-send", ({ userName, room, message }) => {
			setMessageToDb({ userName, room, message, io, socket });
		});
	});
};

const joinAUserInARoom = async ({ io, socket, username, roomName }) => {
	console.log("ff", roomName);
	socket.join(roomName);
	let messageObj = {
		userName: username,
		message: "Just joined",
		room: roomName,
		broadCastMessage: true,
	};

	let messages = new MessagesCollection(messageObj);

	await messages
		.save()
		.then((result) => {
			result["socketId"] = socket.io;
			io.to(roomName).emit("new-user-joined", result);
		})
		.catch((err) => console.error(err.message));
};

const kickClientFromRoom = ({ io, socket, room }) => {
	socket.leave();
};

const setMessageToDb = async ({ userName, room, message, io, socket }) => {
	let messageObj = { userName, room, message };

	let messages = new MessagesCollection(messageObj);

	await messages
		.save()
		.then((result) => io.to(room).emit("new-messages", result))
		.catch((err) => console.error(err.message));
};
