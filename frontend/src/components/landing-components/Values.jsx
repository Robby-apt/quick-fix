import React from 'react';
import Card from './Card';
import ourValues from '../../our-values';

function Values() {
	return (
		<div className="section workingsSection grayBg">
			<h2 className="sectionTitle">Our Values</h2>

			<div className="cardDisplay">
				{ourValues.map((working, index) => (
					<Card
						key={index}
						iconClass={working.iconClass}
						title={working.title}
						description={working.description}
					/>
				))}
			</div>
		</div>
	);
}

export default Values;
