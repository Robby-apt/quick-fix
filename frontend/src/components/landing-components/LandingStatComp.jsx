import React from 'react';

function LandingStatComp(props) {
	return (
		<div className="landingStatComp">
			<i className={props.iconClass} />
			<h4 className="cardTitle">{props.title}</h4>
			<p>{props.description}</p>
		</div>
	);
}

export default LandingStatComp;
