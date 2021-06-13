import React, { useCallback, useEffect, useState } from "react";

// import { addUser } from "../../../store/actions/AddUsersAtions";
import { useDispatch } from "react-redux";

const MessageComponent = ({ socket, username }) => {
	const [messages, setMessages] = useState([]);

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
