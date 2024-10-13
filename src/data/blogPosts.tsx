export interface BlogPost {
	id: string;
	title: string;
	date: string;
	content: string;
}

export const blogPosts: BlogPost[] = [
	{
		id: "coming-soon",
		title: "Coming soon",
		date: "October 2024",
		content: `Coming soon, to a Denny's near you!`,
	},
];
