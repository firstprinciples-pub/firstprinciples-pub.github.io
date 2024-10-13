import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { blogPosts } from "../data/blogPosts";

const BlogPostPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const post = blogPosts.find((p) => p.id === id);

	if (!post) return <p>Post not found</p>;

	return (
		<>
			<Header />
			<main className="blog-post">
				<h1>{post.title}</h1>
				<p className="date">{post.date}</p>
				<div className="content">{post.content}</div>
			</main>
		</>
	);
};

export default BlogPostPage;
