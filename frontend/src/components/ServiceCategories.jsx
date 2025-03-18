import React from 'react';
import ServiceItem from './ServiceItem';
import serviceList from '../service-list';

function ServiceCategories() {
	return (
		<div className="section serviceMiniSection">
			<h2 className="sectionTitle">Service Categories</h2>

			<h3 className="sectionSubtitle">
				Browse our comprehensive range of home services provided by
				verified professionals
			</h3>

			<div className="servicesDisplay">
				{serviceList.map((service, key) => (
					<ServiceItem
						iconClass={service.iconClass}
						name={service.name}
						description={service.description}
						jobs={service.jobs}
					/>
				))}
			</div>
		</div>
	);
}

export default ServiceCategories;
