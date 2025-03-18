import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ServicesAbout from '../components/ServicesAbout';
import Workings from '../components/Workings';
import ServiceCategories from '../components/ServiceCategories';
import GetStarted from '../components/GetStarted';
import LandingStats from '../components/LandingStats';
import Footer from '../components/Footer';

function Services() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="servicesPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>

			<ServicesAbout setResNavShowing={setResNavShowing} />

			<Workings />

			<ServiceCategories />

			<GetStarted />

			<LandingStats />

			<Footer />
		</div>
	);
}

export default Services;
