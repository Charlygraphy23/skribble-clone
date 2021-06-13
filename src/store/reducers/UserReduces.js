/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import {
	ADD_USER,
	ADD_MY_SOCKET_ID,
	ADD_LIST_USERS,
} from "../actions/AddUsersAtions.js";

let initialState = {
	users: [],
	socketId: "",
};

export default (state = initialState, action) => {
	const { userData, socketId, userLists } = action;

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
		default:
			return state;
	}
};
