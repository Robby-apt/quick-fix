import React from 'react';
import { Link } from 'react-router-dom';

function ServicesCol() {
	return (
		<div className="footerCol servicesCol">
			<h4>Services</h4>

			<div className="subCol">
				<p>Plumbing</p>
				<p>Electrical</p>
				<p>Roofing</p>
				<Link to="/services">View All</Link>
			</div>
		</div>
	);
}

export default ServicesCol;
