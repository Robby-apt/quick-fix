import React, { useState } from 'react';
import Navbar from '../components/landing-components/Navbar';
import Footer from '../components/landing-components/Footer';

function ForgotPass() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="forgotPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>

			<div className="section grayBg userRegBg">
				<p>ForgotPass</p>
			</div>

			<Footer />
		</div>
	);
}

export default ForgotPass;
