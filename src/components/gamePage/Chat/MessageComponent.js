import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import { SOCKET_URL } from "../../../config/app.config";

const MessageComponent = () => {
	const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState([]);
	const [username, setUsername] = useState("");
	const [text, setText] = useState("");

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

		setSocket(tempSocket);

		return () => {
			tempSocket.disconnect("demo");
		};
	}, [username]);

	useEffect(() => {
		if (!socket) return;
		socket.on("new-user-joined", (messageData) => {
			console.log("Hello", messageData);
			setMessages((prevState) => [...prevState, messageData]);
		});

		socket.on("new-messages", (messageData) => {
			setMessages((prevState) => [...prevState, messageData]);
		});

		return () => {
			socket.disconnect();
		};
	}, [socket]);

	const handleMessageSend = useCallback(
		(e) => {
			e.preventDefault();
			if (!text) return;
			socket.emit("message-send", {
				userName: username,
				room: "demo",
				message: text,
			});

			setText("");
		},
		[text, username, socket]
	);

	return (
		<div className='chat__container'>
			<div className='chat__body'>
				{messages.length > 0 &&
					messages.map((value, i) => (
						<p
							className={`content ${
								value?.broadCastMessage ? "text-success" : ""
							}`}
							key={i}>
							<span>
								<span className='name'>{value.userName}</span>
								<span className='message'>{value.message}</span>
							</span>
							<span className='time'>
								{new Date(value.createdAt).toLocaleDateString()}
							</span>
						</p>
					))}
			</div>

			<form action='#' className='chat__footer' onSubmit={handleMessageSend}>
				<input
					type='text'
					className='form__input'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button type='submit' className='send'>
					<i className='bi bi-chevron-right'></i>
				</button>
			</form>
		</div>
	);
};

export default MessageComponent;
