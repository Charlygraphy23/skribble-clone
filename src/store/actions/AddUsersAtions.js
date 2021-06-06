export const ADD_USER = "ADD_USER";

export const addUser = (userData) => {
	return {
		type: ADD_USER,
		userData,
	};
};
