import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserScore } from "../../../store/actions/AddUsersAtions";

const Players = ({ socket }) => {
	const { users, socketId, currentlyPlayedUser } = useSelector(
		(state) => state.UserReducer
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!socket) return;

		socket.on("get_points", (data) => {
			dispatch(updateUserScore(data));
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	return (
		<div className='players'>
			{users.length > 0 &&
				users.map((value, i) => (
					<div
						key={i}
						className='d-flex justify-content-between align-items-center mb-1'
						style={{ backgroundColor: "rgb(212, 212, 212)" }}>
						<div className='player__cards'>
							<h4>
								{value?.name} {value?.id === socketId ? "(you)" : ""}
							</h4>
							<span>Score : {value?.scores?.points}</span>
						</div>
						{currentlyPlayedUser?.id === value?.id && (
							<span className='pen'>
								<i className='bi bi-pen-fill'></i>
							</span>
						)}
					</div>
				))}
		</div>
	);
};

export default Players;
