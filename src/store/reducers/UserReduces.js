/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
import { ADD_USER } from "../actions/AddUsersAtions.js";

let initialState = {
	users: [],
};

export default (state = initialState, action) => {
	const { userData } = action;

	switch (action.type) {
		case ADD_USER:
			return {
				...state,
				users: [...state.users, userData],
			};
		default:
			return state;
	}
};
