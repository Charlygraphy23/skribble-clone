import React from "react";

const GameOverModal = ({ message }) => {
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
						<h3 className='head__text'>{message ? message : "GAME OVER"}</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameOverModal;
