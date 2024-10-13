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
			<article>
				<h1>{post.title}</h1>
				<p>{post.date}</p>
				<div>{post.content}</div>
			</article>
		</>
	);
};

export default BlogPostPage;
