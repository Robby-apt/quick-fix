import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Workings from '../components/Workings';
import ServiceMini from '../components/ServiceMini';
import CustomerReviews from '../components/CustomerReviews';

function Landing() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="landingPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>

			<Hero setResNavShowing={setResNavShowing} />

			<Workings />

			<ServiceMini />

			<CustomerReviews />
		</div>
	);
}

export default Landing;
