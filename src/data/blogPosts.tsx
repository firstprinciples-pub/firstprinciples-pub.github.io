export interface BlogPost {
	id: string;
	title: string;
	date: string;
	content: string;
}

export const blogPosts: BlogPost[] = [
	{
		id: "intro",
		title: "Introduction to First Principles",
		date: "October 2024",
		content: `Welcome to First Principles! This blog will explore fundamental concepts, 
              grounded research, and more. Stay tuned for insightful discussions and updates.`,
	},
];
