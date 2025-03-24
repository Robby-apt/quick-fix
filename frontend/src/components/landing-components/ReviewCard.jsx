import React from 'react';
import StarRating from './StarRating';

function ReviewCard(props) {
	return (
		<div className="reviewCard">
			<div className="starsDisplay">
				<StarRating stars={props.stars} />
			</div>

			<p className="reviewText">{props.review}</p>

			<div className="customerInfo">
				<img src={props.imgSrc} alt={props.name} />
				<div className="nameAndPosition">
					<h4>{props.name}</h4>
					<p>{props.position}</p>
				</div>
			</div>
		</div>
	);
}

export default ReviewCard;
