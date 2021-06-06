import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "../../pages/homePage/HomePage";
import AuthRoute from "../auth/AuthRoute";

const HomeRoute = () => {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={AuthRoute} />
			</Switch>
		</Router>
	);
};

export default HomeRoute;
