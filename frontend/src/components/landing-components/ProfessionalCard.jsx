import React from 'react';
import { Link } from 'react-router-dom';

function ProfessionalCard(props) {
	return (
		<div id="cardProf" className="professionalCard">
			<div className="imgAndReviews">
				<img src={props.providerImg} alt={props.providerName} />

				<div className="professionalReview">
					<i className="fa-solid fa-star" />
					<p>
						<span>{props.providerRating}</span>
						{` (${props.providerReviews} reviews)`}
					</p>
				</div>
			</div>

			<div className="professionalDetails">
				<h4>{props.providerName}</h4>
				<h5>{props.providerSpecialty}</h5>
				<p>{props.providerDescription}</p>
				<Link to="/signup">Book Now</Link>
			</div>
		</div>
	);
}

export default ProfessionalCard;
