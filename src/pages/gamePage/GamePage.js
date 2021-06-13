import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Canvas from "../../components/gamePage/canvas/Canvas";
import MessageComponent from "../../components/gamePage/Chat/MessageComponent";
import Players from "../../components/gamePage/Users/Players";
import { SOCKET_URL } from "../../config/app.config";
import {
	addMySocketID,
	addListOfUsers,
	addUser,
} from "../../store/actions/AddUsersAtions";
import { useDispatch } from "react-redux";

const GamePage = () => {
	const [socket, setSocket] = useState(null);
	const [username, setUsername] = useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		let name = prompt("Enter ur name");
		setUsername(name);
	}, []);

	useEffect(() => {
		if (!username) return;
		let tempSocket = io(SOCKET_URL, {
			reconnectionDelayMax: 10000,
			query: {
				room: "demo",
				username: username,
			},
		});

		tempSocket.connect();

		tempSocket.on("connect", () => {
			dispatch(addMySocketID(tempSocket?.id));
		});

		setSocket(tempSocket);

		return () => {
			tempSocket.disconnect();
		};
	}, [username, dispatch]);

	useEffect(() => {
		if (!socket) return;

		// add latest user to array
		socket.on("user_joined", (userData) => {
			console.log("NNNNEE", userData);
			dispatch(addUser(userData));
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (!socket) return;
		socket.emit("getAllUsers-Trigger", "demo");
		socket.on("getAllUsers", (userData) => {
			console.log("-----FFF", userData);
			// userData = userData.filter((value) => value?.socketId !== socket?.id);
			dispatch(addListOfUsers(userData));
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	return (
		<div className='game__page'>
			<div className='header'>
				<h1 className='game__brand'>sKuBBle</h1>
			</div>
			<div className='devider'>
				<div className='left'>
					<h4>Time</h4>
					<h4>Rounds</h4>
				</div>

				<h4 className='clue'>Clue</h4>

				<h4>Logo</h4>
			</div>
			<div className='row m-0 my-5'>
				<div className='col-2'>
					<Players />
				</div>

				<div className='col-7'>
					<Canvas socket={socket} />
				</div>

				<div className='col-3'>
					<MessageComponent socket={socket} username={username} />
				</div>
			</div>
		</div>
	);
};

export default GamePage;
