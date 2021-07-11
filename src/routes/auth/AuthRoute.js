import React from "react";
import GamePage from "../../pages/gamePage/GamePage";
import { useSelector } from "react-redux";
import HomePage from "../../pages/homePage/HomePage";

const AuthRoute = () => {
	const { username } = useSelector((state) => state.UserReducer);

	if (username) return <GamePage />;
	return <HomePage />;
};

export default AuthRoute;
