import React from "react";
import Header from "../components/Header";
import BlogPostPreview from "../components/BlogPostPreview";
import { blogPosts } from "../data/blogPosts";

const HomePage: React.FC = () => (
	<>
		<Header />
		<main>
			{blogPosts.map((post) => (
				<BlogPostPreview key={post.id} post={post} />
			))}
		</main>
	</>
);

export default HomePage;
