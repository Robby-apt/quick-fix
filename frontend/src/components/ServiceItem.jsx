import React from 'react';

function ServiceItem(props) {
	return (
		<div className="serviceItem">
			<div className="iconBg">
				<i className={`topIcon ${props.iconClass}`} />
			</div>

			<h4 className="cardTitle">{props.name}</h4>

			<h6>{props.description}</h6>

			<div className="jobList">
				{props.jobs.map((job, index) => (
					<div className="jobItem" key={index}>
						<i class="fa-solid fa-check" />
						<p>{job}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default ServiceItem;
