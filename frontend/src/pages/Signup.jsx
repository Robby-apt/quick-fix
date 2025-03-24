import React, { useState } from 'react';
import Navbar from '../components/landing-components/Navbar';
import Footer from '../components/landing-components/Footer';

function Signup() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="signupPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>

			<div className="section grayBg userRegBg">
				<p>Signup</p>
			</div>

			<Footer />
		</div>
	);
}

export default Signup;
