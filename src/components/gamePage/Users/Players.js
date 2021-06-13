import React from "react";
import { useSelector } from "react-redux";

const Players = () => {
	const { users, socketId } = useSelector((state) => state.UserReducer);

	return (
		<div className='players'>
			{users.length > 0 &&
				users.map((value, i) => (
					<div key={i} className='player__cards'>
						<h4>
							{value?.userName} {value?.socketId === socketId ? "(you)" : ""}
						</h4>
						<span>Score</span>
					</div>
				))}
		</div>
	);
};

export default Players;
