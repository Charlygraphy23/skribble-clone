import React from "react";
import HomeNav from "../../components/HomePage/HomeNav";

const HomePage = () => {
	return (
		<div className='homePage'>
			<div className='container'>
				<div className='header'>
					<HomeNav />
				</div>

				<div className='homePage__body'>
					<form action='#' className='homePage__form'>
						<input
							type='text'
							className='input__field'
							placeholder='Enter your name'
							required
						/>
						<button className='playButton'>Play</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
