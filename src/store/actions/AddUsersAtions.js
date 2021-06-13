export const ADD_USER = "ADD_USER";
export const ADD_MY_SOCKET_ID = "ADD_MY_SOCKET_ID";
export const ADD_LIST_USERS = "ADD_LIST_USERS";

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
