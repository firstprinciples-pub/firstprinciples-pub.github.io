import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { blogPosts } from "../data/blogPosts";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./BlogPostPage.css";

const BlogPostPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const post = blogPosts.find((p) => p.id === id);

	const [modalImage, setModalImage] = useState<string | null>(null);

	if (!post) return <p>Post not found</p>;

	const handleImageClick = (src: string) => {
		setModalImage(src);
	};

	const closeModal = () => {
		setModalImage(null);
	};

	const renderContent = (
		content: Array<{ type: string; [key: string]: any }>
	) => {
		return content.map((block, index) => {
			switch (block.type) {
				case "html":
					return (
						<div
							key={index}
							dangerouslySetInnerHTML={{ __html: block.value }}
						/>
					);
				case "code":
					return (
						<SyntaxHighlighter
							key={index}
							style={theme}
							language={block.language}
							PreTag="pre"
						>
							{block.value}
						</SyntaxHighlighter>
					);
				case "image":
					return (
						<img
							key={index}
							src={block.src}
							alt={block.alt}
							className="clickable-img"
							onClick={() => handleImageClick(block.src)}
						/>
					);
				default:
					return null;
			}
		});
	};

	return (
		<>
			<Header />
			<MathJaxContext>
				<main className="blog-post">
					<h1>{post.title}</h1>
					<p className="date">{post.date}</p>
					<p className="author">By {post.authors.join(", ")}</p>
					<div className="content">{renderContent(post.content)}</div>
					{modalImage && (
						<div className="modal-overlay" onClick={closeModal}>
							<div
								className="modal-content"
								onClick={(e) => e.stopPropagation()}
							>
								<img src={modalImage} alt="Expanded" />
							</div>
						</div>
					)}
				</main>
			</MathJaxContext>
		</>
	);
};

export default BlogPostPage;
