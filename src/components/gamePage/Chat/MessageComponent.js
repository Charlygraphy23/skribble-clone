import React, { useCallback, useEffect, useState } from "react";

import { removeUser } from "../../../store/actions/AddUsersAtions";
import { useDispatch, useSelector } from "react-redux";

const MessageComponent = ({ socket, username }) => {
	const [messages, setMessages] = useState([]);
	const { users, word } = useSelector((state) => state.UserReducer);

	const [text, setText] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		if (!socket) return;
		socket.on("new-user-joined-chat", (messageData) => {
			setMessages((prevState) => [...prevState, messageData]);
		});

		socket.on("new-messages", (messageData) => {
			setMessages((prevState) => [...prevState, messageData]);
		});

		return () => {
			socket.disconnect();
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (!socket) return;

		// add latest user to array
		socket.on("user_joined-chat-message", (userData) => {
			const message = {
				message: "Just joined",
				broadcast: true,
				userId: userData?.id,
				name: userData?.name,
				time: new Date(),
			};
			setMessages((prevState) => [...prevState, message]);
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (!socket) return;
		if (!users) return;

		socket.on("delete-user-broadcast", (userId) => {
			users.forEach((value) => {
				if (value?.id === userId) {
					const message = {
						message: "Is removed",
						removed: true,
						userId: userId,
						name: value?.name,
						time: new Date(),
					};
					setMessages((prevState) => [...prevState, message]);

					dispatch(removeUser(userId));
				}
			});
		});
	}, [users, socket, dispatch]);

	const handleMessageSend = useCallback(
		(e) => {
			e.preventDefault();
			if (!text) return;
			if (text === word) {
				socket.emit("guessed_word", { id: socket.id, room: "demo" });
			}
			socket.emit("message-send", {
				userName: username,
				room: "demo",
				message: text,
			});

			setText("");
		},
		[text, username, socket, word]
	);

	return (
		<div className='chat__container'>
			<div className='chat__body'>
				{messages.length > 0 &&
					messages.map((value, i) => (
						<div
							className={`content ${
								value?.broadcast
									? "text-success"
									: value?.removed
									? "text-danger"
									: ""
							}`}
							key={i}>
							<div className='d-flex'>
								<span className='name'>{value.name}</span>
								<p
									className={
										word === value?.message ? "text-info message" : "message"
									}>
									{value.message}
								</p>
								{
									// when word gets matched
								}
								{value.message === word && (
									<span className='time ml-1'>
										<small>matched</small>
									</span>
								)}
							</div>
							<span className='time'>
								{new Date(value.time).toLocaleTimeString()}
							</span>
						</div>
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
