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
} from "../../store/actions/AddUsersAtions";
import { useDispatch, useSelector } from "react-redux";
const ROOM = "demo";
const GamePage = () => {
	const [socket, setSocket] = useState(null);
	const [username, setUsername] = useState("");
	const { color, drawAction, lineWidth } = useSelector(
		(state) => state.UserReducer
	);
	const [clearAll, setClearAll] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		let name = prompt("Enter ur name");
		setUsername(name);
	}, []);

	useEffect(() => {
		if (!username) return;
		let tempSocket = io(SOCKET_URL, {
			reconnectionDelayMax: 10000,
			query: {
				room: "demo",
				username: username,
			},
		});

		tempSocket.connect();
		console.log(COLOR_LIST);

		tempSocket.on("connect", () => {
			dispatch(addMySocketID(tempSocket?.id));
		});

		setSocket(tempSocket);

		return () => {
			tempSocket.disconnect();
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
		socket.emit("getAllUsers", "demo", (data) => {
			console.log(data);

			dispatch(addListOfUsers(data));
		});

		socket.on("set-color", (color) => {
			console.log("SET COLOR");
			dispatch(changeColor(color));
		});
		socket.on("set-brush", (brushType) => {
			console.log("SET BRUSH");
			dispatch(changeDrawAction(brushType));
		});
		socket.on("set-clear-all", (clear) => {
			console.log("SET CLEAR_ALL");
			setClearAll((prevState) => !prevState);
		});
		socket.on("set-brush-size", (size) => {
			console.log("SET BRUSH_SIZE");
			dispatch(changeLineWidth(size));
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket, dispatch]);

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
					<Players socket={socket} />
				</div>

				<div className='col-7'>
					<Canvas socket={socket} clearAll={clearAll} />
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

								<div className='dropdown-menu ' aria-labelledby='brushDropdown'>
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
				</div>

				<div className='col-3'>
					<MessageComponent socket={socket} username={username} />
				</div>
			</div>
		</div>
	);
};

export default GamePage;
