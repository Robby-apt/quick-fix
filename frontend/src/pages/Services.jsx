import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing-components/Navbar';
import ServicesAbout from '../components/landing-components/ServicesAbout';
import Workings from '../components/landing-components/Workings';
import ServiceCategories from '../components/landing-components/ServiceCategories';
import FeaturedProvider from '../components/landing-components/FeaturedProvider';
import GetStarted from '../components/landing-components/GetStarted';
import LandingStats from '../components/landing-components/LandingStats';
import Footer from '../components/landing-components/Footer';

function Services(props) {
	let [isResNavShowing, setResNavShowing] = useState(false);

	// Update currentPage when the component mounts
	useEffect(() => {
		props.setCurrentPage('services');
	}, [props]);

	return (
		<div className="page" id="servicesPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
				currentPage={props.currentPage}
				setCurrentPage={props.setCurrentPage}
			/>

			<ServicesAbout setResNavShowing={setResNavShowing} />

			<Workings />

			<ServiceCategories />

            <FeaturedProvider />

			<GetStarted />

			<LandingStats />

			<Footer />
		</div>
	);
}

export default Services;
