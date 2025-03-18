import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Workings from '../components/Workings';
import ServiceMini from '../components/ServiceMini';
import CustomerReviews from '../components/CustomerReviews';
import GetStarted from '../components/GetStarted';
import Footer from '../components/Footer';

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

			<GetStarted />

			<Footer />
		</div>
	);
}

export default Landing;
