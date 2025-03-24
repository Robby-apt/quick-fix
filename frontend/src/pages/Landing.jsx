import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing-components/Navbar';
import Hero from '../components/landing-components/Hero';
import Workings from '../components/landing-components/Workings';
import ServiceMini from '../components/landing-components/ServiceMini';
import FeaturedProvider from '../components/landing-components/FeaturedProvider';
import CustomerReviews from '../components/landing-components/CustomerReviews';
import GetStarted from '../components/landing-components/GetStarted';
import Footer from '../components/landing-components/Footer';

function Landing(props) {
	const [isResNavShowing, setResNavShowing] = useState(false);

	// Update currentPage when the component mounts
	useEffect(() => {
		props.setCurrentPage('home');
	}, [props]);

	return (
		<div className="page" id="landingPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
				currentPage={props.currentPage}
			/>

			<Hero setResNavShowing={setResNavShowing} />

			<Workings />

			<ServiceMini />

			<FeaturedProvider />

			<CustomerReviews />

			<GetStarted />

			<Footer />
		</div>
	);
}

export default Landing;
