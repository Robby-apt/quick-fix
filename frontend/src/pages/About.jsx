import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import QuickfixAbout from '../components/QuickfixAbout';
import OurStory from '../components/OurStory';
import Values from '../components/Values';
import LandingStats from '../components/LandingStats';
import Footer from '../components/Footer';

function About() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="aboutPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
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
