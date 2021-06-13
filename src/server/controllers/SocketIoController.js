/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import MessagesCollection from "../models/MessagesModel.js";
import Users from "../models/UsersModel.js";
import Rooms from "../models/Rooms.js";

export default (io) => {
	io.on("connection", (socket) => {
		let roomName = socket.handshake.query.room;
		let username = socket.handshake.query.username;
		joinAUserInARoom({ io, socket, username, roomName });

		// remove users on that room
		socket.on("disconnect", (room) => {
			kickClientFromRoom({ io, socket, room });
		});

		socket.on("message-send", ({ userName, room, message }) => {
			setMessageToDb({ userName, room, message, io, socket });
		});

		socket.on("getAllUsers-Trigger", (roomName) => {
			getAllUserByRoomName(roomName)
				.then((allUsers) => {
					socket.emit("getAllUsers", allUsers);
				})
				.catch((err) => console.error(err));
		});

		socket.on("start-drawing-trigger", ({ room, x, y }) => {
			let __tempObj = { x, y };
			socket.to(room).emit("start-drawing-listner", __tempObj);
		});

		socket.on("stop-drawing-trigger", ({ room }) => {
			socket.to(room).emit("stop-drawing-listner");
		});

		socket.on("drawing-trigger", ({ room, x, y }) => {
			let __tempObj = { x, y };
			socket.to(room).emit("drawing-listner", __tempObj);
		});
	});
};

const joinAUserInARoom = async ({ io, socket, username, roomName }) => {
	// TODO: check if room is already exist or not

	Rooms.findOne({ roomName })
		.then(async (roomNameIsFound) => {
			if (roomNameIsFound) {
				await addUserToARoom(username, socket?.id, roomNameIsFound?._id)
					.then(async (userData) => {
						await addBoradCastMessage(username, roomName)
							.then((data) => {
								socket.join(roomName);
								io.to(roomName).emit("new-user-joined-chat", data);
								socket.broadcast.to(roomName).emit("user_joined", userData);
							})
							.catch((err) => console.error(err));
					})
					.catch((err) => console.error(err));
			} else {
				let addRoom = new Rooms({
					roomName,
				});
				addRoom.save().then(async (roomNameIsFound) => {
					await addUserToARoom(username, socket?.id, roomNameIsFound?._id)
						.then(async (userData) => {
							await addBoradCastMessage(username, roomName)
								.then((data) => {
									socket.join(roomName);
									io.to(roomName).emit("new-user-joined-chat", data);
									socket.broadcast.to(roomName).emit("user_joined", userData);
								})
								.catch((err) => console.error(err));
						})
						.catch((err) => console.error(err));
				});
			}
		})
		.catch((err) => console.error(err));
};

const addUserToARoom = (userName, socketId, roomId) => {
	let addUser = new Users({
		userName,
		socketId,
		roomId,
	});

	return new Promise((resolve, reject) => {
		addUser
			.save()
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const getAllUserByRoomName = (room) => {
	return new Promise((resolve, reject) => {
		Rooms.findOne({ roomName: room, active: true })
			.then((roomFound) => {
				if (roomFound) {
					Users.find({ roomId: roomFound._id })
						.then((allUsers) => {
							console.log("---LOG--", allUsers);
							resolve(allUsers);
						})
						.catch((err) => reject(err));
				} else {
					resolve([]);
				}
			})
			.catch((err) => reject(err));
	});
};

const addBoradCastMessage = async (username, roomName) => {
	let messageObj = {
		userName: username,
		message: "Just joined",
		room: roomName,
		broadCastMessage: true,
	};

	let messages = new MessagesCollection(messageObj);

	return new Promise(async (resolve, reject) => {
		await messages
			.save()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => reject(err));
	});
};

const kickClientFromRoom = async ({ io, socket, room }) => {
	socket.leave();
	await Users.findOneAndDelete({ socketId: socket.id }).catch((err) =>
		console.error(err)
	);
};

const setMessageToDb = async ({ userName, room, message, io, socket }) => {
	let messageObj = { userName, room, message };

	let messages = new MessagesCollection(messageObj);

	await messages
		.save()
		.then((result) => io.to(room).emit("new-messages", result))
		.catch((err) => console.error(err.message));
};
