import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../data/blogPosts";

interface BlogPostPreviewProps {
	post: BlogPost;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ post }) => (
	<article>
		<h2>{post.title}</h2>
		<p>{post.date}</p>
		<Link to={`/post/${post.id}`}>Read more</Link>
	</article>
);

export default BlogPostPreview;
