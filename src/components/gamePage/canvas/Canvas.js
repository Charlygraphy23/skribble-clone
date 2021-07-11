import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const STROKE_ADJUST_Y = 13;

const Canvas = ({ socket, clearAll }) => {
	const canvasRef = useRef(null);
	const canvasOverFlowRef = useRef(null);
	const contextRef = useRef(null);
	const contextOverFlowRef = useRef(null);
	const { color, drawAction, lineWidth, currentlyPlayedUser, socketId } =
		useSelector((state) => state.UserReducer);

	const [state, setState] = useState({
		offsetX: 0,
		offsetY: 0,
		startX: 0,
		startY: 0,
	});

	const [isDrawing, setIsDrawing] = useState(false);
	const [type, setType] = useState("");

	useEffect(() => {
		const box = document.getElementById("canvas-box");
		const canvas = canvasRef.current;
		const canvas_overflow = canvasOverFlowRef.current;

		console.log("ppppp", box.offsetWidth);
		canvas.width = box.offsetWidth;
		canvas.height = box.offsetHeight;
		canvas.style.width = `${box.offsetWidth}px`;
		canvas.style.height = `${box.offsetHeight}px`;
		// canvas.style.cursor = "pointer";

		let canvasRect = canvas.getBoundingClientRect();

		const context = canvas.getContext("2d");
		context.lineJoin = context.lineCap = "round";
		context.lineWidth = 1;

		const contextOverFlow = canvas_overflow.getContext("2d");
		contextOverFlow.lineJoin = contextOverFlow.lineCap = "round";
		contextOverFlow.lineWidth = 1;
		contextOverFlow.strokeStyle = "blue";

		contextOverFlowRef.current = contextOverFlow;
		contextRef.current = context;
		setState({
			offsetX: canvasRect.left,
			offsetY: canvasRect.top,
		});
	}, [clearAll]);

	// useEffect(() => {
	// 	console.log("GGG-GGG", contextRef.current.height);

	// 	contextRef.current.clearRect(0, 0, 700, 500);
	// }, [clearAll]);

	useEffect(() => {
		setType(drawAction === "ERESER" ? "PEN" : drawAction);
		if (drawAction === "ERESER") contextRef.current.strokeStyle = "#FFFFFF";
		else contextRef.current.strokeStyle = color;
		contextRef.current.lineWidth = lineWidth;
	}, [drawAction, color, lineWidth]);

	useEffect(() => {
		if (!socket) return;

		socket.on("drawing-listner", ({ x, y }) => {
			console.log("YYYYY");
			contextRef.current.lineTo(x, y);
			contextRef.current.stroke();
		});
		socket.on("start-drawing-listner", ({ x, y }) => {
			contextRef.current.beginPath();
			contextRef.current.moveTo(x, y);
		});

		socket.on("stop-drawing-listner", () => {
			setIsDrawing(false);
			contextRef.current.closePath();
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [socket]);

	const startDrawing = (e) => {
		if (currentlyPlayedUser?.id !== socketId) {
			setIsDrawing(false);
			return;
		}
		setIsDrawing(true);
		contextRef.current.beginPath();

		if (type === "PEN") {
			let x = e.clientX - state.offsetX;
			let y = e.clientY - state.offsetY;
			contextRef.current.moveTo(x, y + STROKE_ADJUST_Y);
			if (socket) {
				let __tempObj = { room: "demo", x, y };
				socket.emit("start-drawing-trigger", __tempObj);
			}
		} else if (type === "RECT") {
			// else draw on overflow canvas
			setState((prevState) => ({
				...prevState,
				startX: e.clientX - state.offsetX,
				startY: e.clientY - state.offsetY,
			}));
		}
	};
	const stopDrawing = (e) => {
		if (currentlyPlayedUser?.id !== socketId) {
			setIsDrawing(false);
			return;
		}
		setIsDrawing(false);
		// if (type === "PEN") ;

		if (type === "RECT" && e) {
			let width = e.clientX - state.offsetX - state.startX;
			let height = e.clientY - state.offsetY - state.startY;
			contextOverFlowRef.current.clearRect(
				0,
				0,
				contextOverFlowRef.current.weight,
				contextOverFlowRef.current.height
			);
			contextRef.current.strokeRect(state.startX, state.startY, width, height);
		}

		if (socket) {
			socket.emit("stop-drawing-trigger", "demo");
		}
		contextRef.current.closePath();
	};
	const drawing = (e) => {
		if (currentlyPlayedUser?.id !== socketId) {
			setIsDrawing(false);
			return;
		}
		const box = document.getElementById("canvas-box");

		if (drawAction === "ERESER") box.style.cursor = `url("erase.svg"), auto`;
		else if (currentlyPlayedUser?.id !== socketId)
			box.style.cursor = `url("dot.svg"), auto`;
		else box.style.cursor = `url("pen.svg"), auto`;

		if (!isDrawing) return;

		if (type === "PEN") {
			let x = e.clientX - state.offsetX;
			let y = e.clientY - state.offsetY;
			contextRef.current.lineTo(x, y + STROKE_ADJUST_Y);
			contextRef.current.stroke();

			if (socket) {
				let __tempObj = { room: "demo", x, y };

				socket.emit("drawing-trigger", __tempObj);
			}
		} else if (type === "RECT") {
			// drawing on overflow context
			contextOverFlowRef.current.clearRect(
				0,
				0,
				contextOverFlowRef.current.width,
				contextOverFlowRef.current.height
			);
			let width = e.clientX - state.offsetX - state.startX;
			let height = e.clientY - state.offsetY - state.startY;
			contextOverFlowRef.current.strokeRect(
				state.startX,
				state.startY,
				width,
				height
			);
		}
	};
	const out = () => {
		stopDrawing();
	};

	return (
		<div className='canvas__container'>
			<div id='canvas-box'>
				<canvas
					className='canvas'
					onMouseDown={startDrawing}
					onMouseUp={stopDrawing}
					onMouseMove={drawing}
					onMouseLeave={out}
					ref={canvasRef}
				/>
			</div>

			<canvas
				className='canvas canvas__overFlow'
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseMove={drawing}
				onMouseLeave={out}
				ref={canvasOverFlowRef}
			/>
		</div>
	);
};

export default Canvas;
