/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import {
	ADD_USER,
	ADD_MY_SOCKET_ID,
	ADD_LIST_USERS,
	ADD_DRAW_ACTION,
	ADD_COLOR,
	ADD_LINE_WIDTH,
	REMOVE_USER,
} from "../actions/AddUsersAtions.js";

let initialState = {
	users: [],
	socketId: "",
	drawAction: "PEN",
	color: "#000000",
	lineWidth: 1,
};

export default (state = initialState, action) => {
	const {
		userData,
		socketId,
		userLists,
		drawAction,
		color,
		lineWidth,
		userID,
	} = action;

	switch (action.type) {
		case ADD_USER:
			return {
				...state,
				users: [...state.users, userData],
			};
		case ADD_MY_SOCKET_ID:
			return {
				...state,
				socketId,
			};
		case ADD_LIST_USERS:
			return {
				...state,
				users: [...userLists, ...state.users],
			};
		case ADD_DRAW_ACTION:
			return {
				...state,
				drawAction,
			};
		case ADD_COLOR:
			return {
				...state,
				color,
			};
		case ADD_LINE_WIDTH:
			return {
				...state,
				lineWidth,
			};
		case REMOVE_USER:
			return {
				...state,
				users: state.users.filter((value) => value?.id !== userID),
			};
		default:
			return state;
	}
};
