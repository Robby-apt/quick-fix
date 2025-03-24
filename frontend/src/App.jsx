import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPass from './pages/ForgotPass';

function App() {
	let [currentPage, setCurrentPage] = useState(`home`);

	return (
		<Routes>
			<Route
				path="/"
				element={
					<Landing
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				}
			/>
			<Route
				path="/about"
				element={
					<About
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				}
			/>
			<Route
				path="/services"
				element={
					<Services
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				}
			/>
			<Route
				path="/contact"
				element={
					<Contact
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				}
			/>
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/forgot-password" element={<ForgotPass />} />
		</Routes>
	);
}

export default App;
