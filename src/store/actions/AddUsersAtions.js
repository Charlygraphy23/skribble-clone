export const ADD_USER = "ADD_USER";
export const ADD_MY_SOCKET_ID = "ADD_MY_SOCKET_ID";
export const ADD_LIST_USERS = "ADD_LIST_USERS";
export const ADD_DRAW_ACTION = "ADD_DRAW_ACTION";
export const ADD_COLOR = "ADD_COLOR";
export const ADD_LINE_WIDTH = "ADD_LINE_WIDTH";
export const REMOVE_USER = "REMOVE_USER";

export const addUser = (userData) => {
	return {
		type: ADD_USER,
		userData,
	};
};

export const addMySocketID = (socketId) => {
	return {
		type: ADD_MY_SOCKET_ID,
		socketId,
	};
};

export const addListOfUsers = (userLists) => {
	return {
		type: ADD_LIST_USERS,
		userLists,
	};
};

export const changeDrawAction = (drawAction) => {
	return {
		type: ADD_DRAW_ACTION,
		drawAction,
	};
};
export const changeColor = (color) => {
	return {
		type: ADD_COLOR,
		color,
	};
};
export const changeLineWidth = (lineWidth) => {
	return {
		type: ADD_LINE_WIDTH,
		lineWidth,
	};
};

export const removeUser = (userID) => {
	return {
		type: REMOVE_USER,
		userID,
	};
};
