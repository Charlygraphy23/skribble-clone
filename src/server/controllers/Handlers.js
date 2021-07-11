let rooms = [];
let users = [];
let messages = [];
let userWhoFinishedTheirRound = [];
const ROOM_PLAYER_STATUS = {
	PLAYING: "PLAYING",
	OVER: "OVER",
};

const WORDS_COLLECTION = ["cars", "bike", "loook"];

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
	io.to(room).emit("delete-user-broadcast", socket?.id);
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

export const handleStartGame = (roomName, rounds, socket, io, time) => {
	console.log("Game Starting");

	if (rooms[roomName]?.users.length <= 0) return;
	if (rooms[roomName]?.status === ROOM_PLAYER_STATUS.PLAYING) return;

	console.log("User Available");
	rooms[roomName].currentPlayerIndex = 0; // this player is playing game now (default 0)
	rooms[roomName].rounds = Number(rounds); // total rounds from host client
	rooms[roomName].currentRound = 1; // current round game is running  (default 2)
	rooms[roomName].status = ROOM_PLAYER_STATUS.PLAYING; // status of the game (PLAYING || OVER)

	const random_Word = getRandomWord();

	let obj = {
		currentPlayerInfo: {
			...rooms[roomName].users[rooms[roomName].currentPlayerIndex],
		},
		totalRounds: rooms[roomName].rounds,
		currentRound: rooms[roomName].currentRound,
		status: ROOM_PLAYER_STATUS.PLAYING,
		word: random_Word,
	};
	// reseting second
	io.in(roomName).emit("on-game-start", obj);

	let intervalId = setInterval(() => {
		if (
			rooms[roomName].status === ROOM_PLAYER_STATUS.OVER ||
			!rooms[roomName].users[rooms[roomName].currentPlayerIndex]
		) {
			console.log("OVER", rooms);
			clearInterval(rooms[roomName].intervalId);
			rooms[roomName].intervalId = 0;
			return;
		}
		startIntervalsForARoom(roomName, io);
		// console.log("KKK", rooms[roomName].currentRound);
	}, Number(time));

	rooms[roomName].intervalId = intervalId;
};

const startIntervalsForARoom = (roomName, io) => {
	rooms[roomName].currentPlayerIndex += 1;

	if (rooms[roomName].currentPlayerIndex >= rooms[roomName].users.length) {
		// if current player is greater than all user count then change round/or game over

		if (rooms[roomName].currentRound >= rooms[roomName].rounds) {
			// when round gets over
			console.log("Rounds", rooms[roomName].currentRound);
			rooms[roomName].status = ROOM_PLAYER_STATUS.OVER;
		} else {
			// current round increasing
			console.log("Rounds else", rooms[roomName].currentRound);
			rooms[roomName].currentRound += 1;
			rooms[roomName].currentPlayerIndex = 0;
		}
	}
	// console.log("Rounds outside", rooms[roomName].users.length);
	const random_Word = getRandomWord();
	let obj = {
		currentPlayerInfo: {
			...rooms[roomName].users[rooms[roomName].currentPlayerIndex],
		},
		totalRounds: rooms[roomName].rounds,
		currentRound: rooms[roomName].currentRound,
		status: rooms[roomName].status,
		word: random_Word,
	};
	io.in(roomName).emit("on-playing-user-change", obj);
};

const getRandomWord = () => {
	const randomWordPic = Math.floor(Math.random() * WORDS_COLLECTION.length);

	return WORDS_COLLECTION[randomWordPic];
};
