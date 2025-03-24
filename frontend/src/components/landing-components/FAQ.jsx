import React from 'react';
import faq from '../../faq';

function FAQ() {
	return (
		<div className="section faqSection">
			<h2 className="sectionTitle">Frequently Asked Questions</h2>

			<div className="qaDiv">
				{faq.map((qa, index) => (
					<div className="qItem" key={index}>
						<h6>{qa.question}</h6>
						<p>{qa.response}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default FAQ;
