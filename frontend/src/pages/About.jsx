import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing-components/Navbar';
import QuickfixAbout from '../components/landing-components/QuickfixAbout';
import OurStory from '../components/landing-components/OurStory';
import Values from '../components/landing-components/Values';
import LandingStats from '../components/landing-components/LandingStats';
import Footer from '../components/landing-components/Footer';

function About(props) {
	let [isResNavShowing, setResNavShowing] = useState(false);

	// Update currentPage when the component mounts
	useEffect(() => {
		props.setCurrentPage('about');
	}, [props]);

	return (
		<div className="page" id="aboutPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
				currentPage={props.currentPage}
				setCurrentPage={props.setCurrentPage}
			/>

			<QuickfixAbout setResNavShowing={setResNavShowing} />

			<OurStory />

			<Values />

			<LandingStats />

			<Footer />
		</div>
	);
}

export default About;
