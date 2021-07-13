import React, { useCallback } from "react";
import { useSelector } from "react-redux";

const GameOverModal = ({ message }) => {
	const { users } = useSelector((state) => state.UserReducer);

	const checkWinner = useCallback(() => {
		let findWinner = users.sort((a, b) => {
			if (a?.scores?.points > b?.scores?.points) return -1;
			return 1;
		});
		return `Winner : ${findWinner[0]?.name}`;
	}, [users]);

	return (
		<div
			className='modal fade'
			id='game_over_modal'
			tabIndex='-1'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog modal-dialog-centered'>
				<div className='modal-content'>
					<div className='modal-body'>
						{message ? (
							<h3 className='head__text'>{message}</h3>
						) : (
							<>
								<h3 className='head__text'>GAME OVER</h3>
								<h4>{checkWinner()}</h4>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameOverModal;
