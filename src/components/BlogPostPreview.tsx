import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../data/blogPosts";
import "./BlogPostPreview.css";

interface BlogPostPreviewProps {
	post: BlogPost;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ post }) => (
	<Link to={`/post/${post.id}`} className="blog-post-preview-link">
		<article className="blog-post-preview">
			<h2>{post.title}</h2>
			<p>{post.date}</p>
			<p>
				<i>{post.authors.join(", ")}</i>
			</p>
		</article>
	</Link>
);

export default BlogPostPreview;
