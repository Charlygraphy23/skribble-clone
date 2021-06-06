import React from "react";
import Canvas from "../../components/gamePage/canvas/Canvas";
import MessageComponent from "../../components/gamePage/Chat/MessageComponent";

const GamePage = () => {
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
					<h1>Hello</h1>
				</div>

				<div className='col-7'>
					<Canvas />
				</div>

				<div className='col-3'>
					<MessageComponent />
				</div>
			</div>
		</div>
	);
};

export default GamePage;
