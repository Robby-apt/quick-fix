import React from 'react';

function StarRating(props) {
	return (
		<>
			{props.stars === 5 ? (
				<>
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
				</>
			) : (
				<>
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-solid fa-star" />
					<i className="fa-regular fa-star" />
				</>
			)}
		</>
	);
}

export default StarRating;
