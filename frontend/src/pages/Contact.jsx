import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing-components/Navbar';
import ContactAbout from '../components/landing-components/ContactAbout';
import ContactFormAndInfo from '../components/landing-components/ContactFormAndInfo';
import MapLocation from '../components/landing-components/MapLocation';
import FAQ from '../components/landing-components/FAQ';
import Footer from '../components/landing-components/Footer';

function Contact(props) {
	let [isResNavShowing, setResNavShowing] = useState(false);

	// Update currentPage when the component mounts
	useEffect(() => {
		props.setCurrentPage('contact');
	}, [props]);

	return (
		<div className="page" id="contactPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
				currentPage={props.currentPage}
				setCurrentPage={props.setCurrentPage}
			/>

			<ContactAbout setResNavShowing={setResNavShowing} />

			<ContactFormAndInfo />

			<MapLocation />

			<FAQ />

			<Footer />
		</div>
	);
}

export default Contact;
