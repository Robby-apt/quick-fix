import React from 'react';
import { Link } from 'react-router-dom';

function QuickLinksCol() {
	return (
		<div className="footerCol quickLinksCol">
			<h4>Quick Links</h4>

			<div className="subCol footerLinks">
				<Link to="/">Home</Link>
				<Link to="/about">About Us</Link>
				<Link to="/services">Services</Link>
				<Link to="/contact">Contact</Link>
			</div>
		</div>
	);
}

export default QuickLinksCol;
