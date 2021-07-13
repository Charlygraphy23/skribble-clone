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
		scores: {
			guess: false,
			points: 0,
		},
	};
	users.push(userData);

	rooms[roomName] = {
		...roomInfo,
		users: users,
	};

	//

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

	cb(data);
};

export const handleStartGame = (roomName, rounds, socket, io, time) => {
	if (rooms[roomName]?.users.length <= 0) return;
	if (rooms[roomName]?.status === ROOM_PLAYER_STATUS.PLAYING) return;

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

	// resertting all scores for users
	rooms[roomName].users.forEach((value, i) => {
		value.scores = {
			guess: false,
			points: 0,
		};
	});

	let intervalId = setInterval(() => {
		if (
			rooms[roomName].status === ROOM_PLAYER_STATUS.OVER ||
			!rooms[roomName].users[rooms[roomName].currentPlayerIndex]
		) {
			clearInterval(rooms[roomName].intervalId);
			rooms[roomName].intervalId = 0;
			return;
		}
		startIntervalsForARoom(roomName, io);
		//
	}, Number(time));

	rooms[roomName].intervalId = intervalId;
};

export const handleUserScore = (id, room, socket, io) => {
	let __tempPoint = 0;
	let flag = false;
	rooms[room].users.forEach((value, i) => {
		if (value?.id === id && !value.scores.guess) {
			__tempPoint = Number(value.scores.points) + 10;
			value.scores.points = __tempPoint;
			value.scores.guess = true;
			flag = true;

			// after increase user point we need to close the round
			if (
				users.filter(
					(value, j) =>
						j !== rooms[room].currentPlayerIndex && value?.scores?.guess
				).length ===
				users.length - 1
			) {
				// then close the round
				startIntervalsForARoom(room, io);
			}
		}
	});

	if (flag)
		io.to(room).emit("get_points", { id: socket.id, points: __tempPoint });
};

const startIntervalsForARoom = (roomName, io) => {
	rooms[roomName].currentPlayerIndex += 1;

	if (rooms[roomName].currentPlayerIndex >= rooms[roomName].users.length) {
		// if current player is greater than all user count then change round/or game over

		if (rooms[roomName].currentRound >= rooms[roomName].rounds) {
			// when round gets over

			rooms[roomName].status = ROOM_PLAYER_STATUS.OVER;
		} else {
			// current round increasing

			rooms[roomName].currentRound += 1;
			rooms[roomName].currentPlayerIndex = 0;
		}
	}
	//
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
	rooms[roomName].users.forEach((value, i) => {
		value.scores = {
			guess: false,
			points: 0,
		};
	});
};

const getRandomWord = () => {
	const randomWordPic = Math.floor(Math.random() * WORDS_COLLECTION.length);

	return WORDS_COLLECTION[randomWordPic];
};
