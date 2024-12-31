import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPostPage from "./pages/BlogPostPage";

const App: React.FC = () => (
	<Router>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/post/:id" element={<BlogPostPage />} />
		</Routes>
	</Router>
);

export default App;
