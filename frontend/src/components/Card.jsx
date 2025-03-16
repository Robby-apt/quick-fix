import React from 'react';

function Card(props) {
	return (
		<div className="card">
			<i className={props.iconClass} />
			<h4 className="cardTitle">{props.title}</h4>
			<p>{props.description}</p>
		</div>
	);
}

export default Card;
