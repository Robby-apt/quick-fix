import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import serviceMini from '../service-mini';

function ServiceMini() {
	return (
		<div className="section serviceMiniSection">
			<h2 className="sectionTitle">How Quick Fix Works</h2>

			<h3 className="sectionSubtitle">
				Quick Fix connects you with skilled professionals for all your
				home repair and maintenance needs.
			</h3>

			<div className="cardDisplay">
				{serviceMini.map((working, index) => (
					<Card
						key={index}
						iconClass={working.iconClass}
						title={working.title}
						description={working.description}
					/>
				))}
			</div>

			<Link to="/services" className="fullServicesBtn">
				View All Services &#8594;
			</Link>
		</div>
	);
}

export default ServiceMini;
