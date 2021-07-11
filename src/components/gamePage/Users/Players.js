import React from "react";
import { useSelector } from "react-redux";
// import { removeUser } from "../../../store/actions/AddUsersAtions";

const Players = () => {
	const { users, socketId, currentlyPlayedUser } = useSelector(
		(state) => state.UserReducer
	);
	// const dispatch = useDispatch();

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
							<span>Score</span>
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
