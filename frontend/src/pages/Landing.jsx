import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function Landing() {
	let [isResNavShowing, setResNavShowing] = useState(false);
	return (
		<div className="page" id="landingPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>
		</div>
	);
}

export default Landing;
