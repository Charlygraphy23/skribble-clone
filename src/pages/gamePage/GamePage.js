import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import Canvas from "../../components/gamePage/canvas/Canvas";
import MessageComponent from "../../components/gamePage/Chat/MessageComponent";
import Players from "../../components/gamePage/Users/Players";
import { SOCKET_URL, COLOR_LIST, BRUSH_SIZE } from "../../config/app.config";
import {
	addMySocketID,
	addListOfUsers,
	addUser,
	changeDrawAction,
	changeColor,
	changeLineWidth,
	addCurrentlyPlayedUser,
	addWinningWord,
} from "../../store/actions/AddUsersAtions";
import { useDispatch, useSelector } from "react-redux";
import GameOverModal from "../../components/Modal/GameOverModal";
import clockSvg from "../../assets/loader-line.svg";
import { AppNotification } from "../../config/notification";

const ROOM = "demo";
const PLAY_TIME = 40000;
const GamePage = () => {
	const [socket, setSocket] = useState(null);
	// const [username, setUsername] = useState("");
	const { drawAction, currentlyPlayedUser, socketId, username } = useSelector(
		(state) => state.UserReducer
	);
	const [clearAll, setClearAll] = useState(false);
	const [currentRound, setCurrentRounds] = useState(0);
	const [playingTime, setPlayingTime] = useState(1);
	const [word, setWord] = useState("");
	const [helpingWord, setHelpingWord] = useState("");
	const [playingStatus, setPlayingStatus] = useState("");
	// message when user turn gets over and user to show the word
	const [message, setMessage] = useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		// let name = prompt("Enter ur name");
		// setUsername(name);
		window.$("#game_over_modal").modal("hide");
	}, []);

	useEffect(() => {
		if (!username) return;
		let notifi = AppNotification.loading({
			message: "Waiting for server to be connect",
		});
		let tempSocket = io(SOCKET_URL, {
			reconnectionDelayMax: 10000,
			query: {
				room: "demo",
				username: username,
			},
		});

		tempSocket.connect();

		tempSocket.on("connect", () => {
			dispatch(addMySocketID(tempSocket?.id));
			setTimeout(() => {
				AppNotification.close(notifi);
				notifi = null;
			}, 1000);
		});

		setSocket(tempSocket);

		return () => {
			tempSocket.disconnect();

			if (notifi) {
				AppNotification.close(notifi);
				notifi = null;
			}
		};
	}, [username, dispatch]);

	useEffect(() => {
		if (!socket) return;

		// add latest user to array
		socket.on("user_joined", (userData) => {
			dispatch(addUser(userData));
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (!socket) return;

		let init = null;
		socket.emit("getAllUsers", "demo", (data) => {
			dispatch(addListOfUsers(data));
		});

		socket.on("set-color", (color) => {
			dispatch(changeColor(color));
		});
		socket.on("set-brush", (brushType) => {
			dispatch(changeDrawAction(brushType));
		});
		socket.on("set-clear-all", (clear) => {
			setClearAll((prevState) => !prevState);
		});
		socket.on("set-brush-size", (size) => {
			dispatch(changeLineWidth(size));
		});

		socket.on("on-game-start", (data) => {
			dispatch(addCurrentlyPlayedUser(data?.currentPlayerInfo));
			setCurrentRounds(data?.currentRound);
			socket.emit("clear-all", clearAll, ROOM);
			setPlayingStatus(data?.status);
			// stating timer
			setPlayingTime(1);
			setWord(data?.word);

			//dispatch word
			dispatch(addWinningWord(data?.word));
			setMessage("");

			init = setInterval(() => {
				setPlayingTime((prevState) => prevState + 1);
			}, 1000);
		});
		socket.on("on-playing-user-change", (data) => {
			dispatch(addCurrentlyPlayedUser(data?.currentPlayerInfo));
			setCurrentRounds(data?.currentRound);
			setWord(data?.word);
			setPlayingStatus(data?.status);
			socket.emit("clear-all", clearAll, ROOM);

			//dispatch word
			dispatch(addWinningWord(data?.word));

			setHelpingWord("");
			if (data?.status === "OVER") {
				window.$("#game_over_modal").modal("show");
				clearInterval(init);
				setMessage("");
				setWord("");
				return;
			}
			// stating timer
			clearInterval(init); // clearing previous timer
			setPlayingTime(1);
			init = setInterval(() => {
				setPlayingTime((prevState) => prevState + 1);
			}, 1000);
		});

		window.$("#myModal").on("hidden.bs.modal", function (event) {
			setMessage("");
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

	useEffect(() => {
		let init;
		let time = 0; //s
		let i = 0;

		let wordToSec = word?.length * 1000;
		let clueStartTime = (PLAY_TIME - wordToSec) / 1000; // total time - word length sec
		console.info("Clue will start in ", clueStartTime, " sec");
		console.info("Clue will start in ", clueStartTime, " sec");

		// checking time to give suggestion
		if (socketId !== currentlyPlayedUser?.id && playingStatus === "PLAYING") {
			init = setInterval(() => {
				if (time >= clueStartTime && i < word?.length) {
					console.warn("I", i);
					setHelpingWord((prevState) => `${prevState}${word[i]}`);
					i++;
				}

				if (i >= word?.length - 1) {
					// if round finish an show user the word
					window.$("#game_over_modal").modal("show");
					setMessage(`Word is : ${word}`);
				}

				time++;
				console.info("time", time);
				console.warn("word length", word?.length);
			}, 1000);
		}

		return () => {
			clearInterval(init);
			time = 0;
			i = 0;
		};
	}, [socketId, currentlyPlayedUser, playingStatus, word]);

	// handle color change value
	const handleColorChange = useCallback(
		(colorValue) => {
			dispatch(changeColor(colorValue));

			if (socket) {
				socket.emit("change-color", colorValue, ROOM);
			}
		},
		[dispatch, socket]
	);

	// handle brush type change
	const handleBrushChange = useCallback(
		(brushType) => {
			dispatch(changeDrawAction(brushType));

			if (socket) {
				socket.emit("change-brush", brushType, ROOM);
			}
		},
		[dispatch, socket]
	);

	// handle function to clean slate
	const handleClearAll = useCallback(() => {
		setClearAll((prevState) => !prevState);

		if (socket) {
			socket.emit("clear-all", clearAll, ROOM);
		}
	}, [setClearAll, socket, clearAll]);

	// handle function to clean slate
	const handleBrushSize = useCallback(
		(brushSize) => {
			dispatch(changeLineWidth(brushSize));

			if (socket) {
				socket.emit("brush-size", brushSize, ROOM);
			}
		},
		[socket, dispatch]
	);

	const handleStartGame = useCallback(() => {
		if (!socket) return;
		let rounds = 2;
		socket.emit("start-game", ROOM, rounds, PLAY_TIME);
	}, [socket]);

	return (
		<div className='game__page'>
			<div className='header'>
				<h1 className='game__brand'>sKuBBle</h1>
			</div>
			<div className='devider'>
				<div className='left'>
					<div className='clock'>
						<img width='40' src={clockSvg} alt='logo' />
						<span>{playingTime}</span>
					</div>
					<h4>{currentRound} Rounds</h4>
				</div>

				<h4 className='clue'>
					{socketId === currentlyPlayedUser?.id ? (
						word
					) : word ? (
						helpingWord +
						Array(
							Number(word?.length - helpingWord?.length)
								? Number(word?.length - helpingWord?.length)
								: 0
						)
							.fill(0)
							.map(() => "-")
					) : (
						<span>--- </span>
					)}
				</h4>

				<button
					className='start__button'
					disabled={playingStatus === "PLAYING"}
					onClick={handleStartGame}>
					Start
				</button>
			</div>
			<div className='row m-0 my-5'>
				<div className='col-2'>
					<Players socket={socket} />
				</div>

				<div className='col-7'>
					<Canvas socket={socket} clearAll={clearAll} />
					{socketId === currentlyPlayedUser?.id && (
						<div className='row m-0 canvas__footer justify-content-between mt-1'>
							<div className='d-flex '>
								<div className='color__grid'>
									{COLOR_LIST.length > 0 &&
										COLOR_LIST.map((value, i) => (
											<span
												key={i}
												style={{ backgroundColor: `${value}` }}
												onClick={() => handleColorChange(value)}></span>
										))}
								</div>

								<div className='d-flex justify-content-center align-items-center ml-4 dropup'>
									<i
										className='bi bi-brush-fill dropdown-toggle'
										id='brushDropdown'
										role='button'
										data-toggle='dropdown'
										aria-haspopup='true'
										aria-expanded='false'></i>

									<div
										className='dropdown-menu '
										aria-labelledby='brushDropdown'>
										<div className='d-flex justify-content-center align-items-center'>
											{BRUSH_SIZE.map((value, i) => (
												<span
													className='brush__size'
													style={{
														margin: "2px",
														width: `${value * 2}px`,
														height: `${value * 2}px`,
													}}
													key={i}
													onClick={() => handleBrushSize(value)}>
													<span className='value'>{value}</span>
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
							<div className='buttons d-flex justify-content-center align-items-center'>
								<div>
									<button
										className={drawAction === "PEN" ? "pen active" : "pen"}
										onClick={() => handleBrushChange("PEN")}>
										<i className='bi bi-pen-fill'></i>
									</button>
									<button
										className={
											drawAction === "ERESER" ? "ereser active" : "ereser"
										}
										onClick={() => handleBrushChange("ERESER")}>
										<i className='bi bi-eraser-fill'></i>
									</button>
									<button className='clearAll' onClick={() => handleClearAll()}>
										<i className='bi bi-trash-fill'></i>
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='col-3'>
					<MessageComponent socket={socket} username={username} />
				</div>
			</div>
			<GameOverModal message={message} />
		</div>
	);
};

export default GamePage;
