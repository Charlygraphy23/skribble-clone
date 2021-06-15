let rooms = [];
let users = [];
let messages = [];

export const joinRoom = ({ io, socket, username, roomName }) => {
	socket.join(roomName);
	const roomInfo = rooms[roomName];
	const userData = {
		id: socket?.id,
		name: username,
	};
	users.push(userData);

	rooms[roomName] = {
		...roomInfo,
		users: users,
	};

	socket.broadcast.to(roomName).emit("user_joined", userData);
	io.in(roomName).emit("user_joined-chat-message", userData);
};
export const kiskUserOutFromRoom = ({ io, socket }) => {
	let room = "demo";
	let data = rooms[room];

	rooms[room].users = data?.users.filter((value) => value?.id !== socket?.id);

	users = users.filter((value) => value?.id !== socket?.id);
};

export const messageSend = ({ userName, room, message, io, socket }) => {
	let obj = {
		message,
		time: new Date(),
		room,
		name: userName,
		userId: socket?.id,
		broadcast: false,
	};

	messages.push(obj);

	const data = rooms[room];

	rooms[room] = {
		...data,
		messages: messages,
	};

	io.in(room).emit("new-messages", obj);
};

export const sendAllUserDataToRoom = ({ socket, io, room, cb }) => {
	let data = rooms[room].users;
	console.log("LL", socket.id);
	console.log("------", data);

	cb(data);
};
