import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="loginPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>
            
			<div className="section grayBg userRegBg">
				<p>Login</p>
			</div>

			<Footer />
		</div>
	);
}

export default Login;
