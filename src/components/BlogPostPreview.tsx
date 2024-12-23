import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../data/blogPosts";
import "./BlogPostPreview.css";

interface BlogPostPreviewProps {
	post: BlogPost;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ post }) => (
	<article className="blog-post-preview">
		<h2>{post.title}</h2>
		<p>{post.date}</p>
		<p>
			<i>{post.authors.join(", ")}</i>
		</p>
		<Link to={`/post/${post.id}`}>Read more</Link>
	</article>
);

export default BlogPostPreview;
