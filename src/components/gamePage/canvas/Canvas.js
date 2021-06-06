import React, { useEffect, useRef, useState } from "react";

const Canvas = () => {
	const canvasRef = useRef(null);
	const canvasOverFlowRef = useRef(null);
	const contextRef = useRef(null);
	const contextOverFlowRef = useRef(null);

	const [state, setState] = useState({
		offsetX: 0,
		offsetY: 0,
		startX: 0,
		startY: 0,
	});

	const [isDrawing, setIsDrawing] = useState(false);
	const [type, setType] = useState("PEN");

	useEffect(() => {
		const box = document.getElementById("canvas-box");
		const canvas = canvasRef.current;
		const canvas_overflow = canvasOverFlowRef.current;

		canvas.width = box.offsetWidth;
		canvas.height = box.offsetHeight;
		canvas.style.width = `${box.offsetWidth}px`;
		canvas.style.height = `${box.offsetHeight}px`;

		let canvasRect = canvas.getBoundingClientRect();

		const context = canvas.getContext("2d");
		context.lineJoin = context.lineCap = "round";
		context.lineWidth = 1;
		context.strokeStyle = "red";

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
	}, []);

	const startDrawing = (e) => {
		setIsDrawing(true);
		contextRef.current.beginPath();

		if (type === "PEN")
			contextRef.current.moveTo(
				e.clientX - state.offsetX,
				e.clientY - state.offsetY
			);
		else if (type === "RECT") {
			// else draw on overflow canvas
			setState((prevState) => ({
				...prevState,
				startX: e.clientX - state.offsetX,
				startY: e.clientY - state.offsetY,
			}));
		}
	};
	const stopDrawing = (e) => {
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

		contextRef.current.closePath();
	};
	const drawing = (e) => {
		if (!isDrawing) return;

		if (type === "PEN") {
			contextRef.current.lineTo(
				e.clientX - state.offsetX,
				e.clientY - state.offsetY
			);
			contextRef.current.stroke();
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
		<div id='canvas-box' className='canvas__container'>
			<canvas
				className='canvas'
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseMove={drawing}
				onMouseLeave={out}
				ref={canvasRef}
			/>

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
