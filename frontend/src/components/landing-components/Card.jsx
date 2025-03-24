import React from 'react';

function Card(props) {
	return (
		<div className="card">
			<div className="iconBg">
				<i className={props.iconClass} />
			</div>
			<h4 className="cardTitle">{props.title}</h4>
			<p>{props.description}</p>
		</div>
	);
}

export default Card;
