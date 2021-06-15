import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../../store/actions/AddUsersAtions";

const Players = ({ socket }) => {
	const { users, socketId } = useSelector((state) => state.UserReducer);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (!socket) return;

	// 	socket.on("delete-user-broadcast", (userId) => {
	// 		debugger;
	// 		dispatch(removeUser(userId));
	// 	});

	// 	return () => {
	// 		if (socket) socket.disconnect();
	// 	};
	// }, [socket, dispatch]);

	// useEffect(() => {
	// 	if (!users) return;

	// 	console.log(users);
	// }, [users]);

	return (
		<div className='players'>
			{users.length > 0 &&
				users.map((value, i) => (
					<div key={i} className='player__cards'>
						<h4>
							{value?.name} {value?.id === socketId ? "(you)" : ""}
						</h4>
						<span>Score</span>
					</div>
				))}
		</div>
	);
};

export default Players;
