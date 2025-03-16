import React from 'react';

function ReviewCard(props) {
	return (
		<div className="reviewCard">
			<p className="reviewText">{props.review}</p>
			<div className="customerInfo">
				<img src={props.imgSrc} alt={props.name} />
				<div className="nameAndPositon">
					<h4>{props.name}</h4>
					<p>{props.position}</p>
				</div>
			</div>
		</div>
	);
}

export default ReviewCard;
