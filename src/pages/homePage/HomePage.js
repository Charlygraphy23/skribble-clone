import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import HomeNav from "../../components/HomePage/HomeNav";
import { addUserName } from "../../store/actions/AddUsersAtions";

const HomePage = () => {
	const [username, setUsername] = useState("");

	const dispatch = useDispatch();

	const handleSubmit = useCallback(() => {
		if (!username) return;

		alert("Are u sure ? ..........");

		dispatch(addUserName(username));
	}, [username, dispatch]);

	return (
		<div className='homePage'>
			<div className='container'>
				<div className='header'>
					<HomeNav />
				</div>

				<div className='homePage__body'>
					<form action='#' className='homePage__form' onSubmit={handleSubmit}>
						<input
							type='text'
							className='input__field'
							placeholder='Enter your name'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<button type='submit' className='playButton'>
							Play
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
