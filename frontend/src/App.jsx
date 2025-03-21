import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPass from './pages/ForgotPass';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/about" element={<About />} />
			<Route path="/services" element={<Services />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/forgot-password" element={<ForgotPass />} />
		</Routes>
	);
}

export default App;
