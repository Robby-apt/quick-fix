import React from 'react';
import ReviewCard from './ReviewCard';
import customerCard from '../customer-card';

function CustomerReviews() {
	return (
		<div className="section customerReviews">
			<h2 className="sectionTitle">What Our Customers Say</h2>

			<h3 className="sectionSubtitle">
				Don't just take our word for it. Here's what people are saying
				about Quick Fix.
			</h3>

			<div className="cardDisplay reviewDisplay">
				{customerCard.map((card, index) => {
					return (
						<ReviewCard
							key={index}
							stars={card.stars}
							review={card.review}
							imgSrc={card.imgSrc}
							name={card.name}
							position={card.position}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default CustomerReviews;
