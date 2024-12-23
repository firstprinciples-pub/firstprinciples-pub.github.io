import image1 from "../images/file-6mBkAAnqEkE2hkR138PkiD.png";
import image2 from "../images/file-AJdFHbqZmAqYmfwsdy3wua.png";
import image3 from "../images/file-PFs5uw2yFWGHyuZLh26yda.png";

export interface BlogPost {
	id: string;
	title: string;
	date: string;
	content: Array<{ type: string; [key: string]: any }>;
}

export const blogPosts: BlogPost[] = [
	{
		id: "coming-soon",
		title: "Coming soon",
		date: "October 12, 2024",
		content: [{ type: "html", value: "Coming soon, to a Denny's near you!" }],
	},
	{
		id: "discord-clustering",
		title: "Visualizing Six Years of Discord Chats",
		date: "December 23, 2024",
		content: [
			{
				type: "html",
				value: `<p>My friend and I have been chatting on Discord almost daily since high school. Over the years, we've exchanged about 48,000 messages. I started wondering what kinds of things we’ve talked about most and whether there were any patterns in our conversations. This post covers how I downloaded, processed, and visualized our entire chat history.</p>`,
			},
			{
				type: "html",
				value: `<h2>Exporting the Chat History</h2><p>To start, I needed a way to export our messages from Discord. I looked into their API but didn’t find an easy solution. Eventually, I discovered <a href="https://github.com/Tyrrrz/DiscordChatExporter" target="_blank">DiscordChatExporter</a>, an open-source tool that allowed me to download all our chat history into 47 JSON files containing around 45,000 messages. It worked perfectly.</p>`,
			},
			{
				type: "html",
				value: `<h2>Generating Message Embeddings</h2><p>Once I had the data, I needed a way to represent each message numerically. I decided to use BERT embeddings from the <code>sentence_transformers</code> library. Each message was converted into a 768-dimensional vector, capturing its semantic meaning. Here’s the code I used:</p>`,
			},
			{
				type: "code",
				language: "python",
				value: `
def generate_bert_embeddings(df):
    """Generate or load BERT embeddings."""
    embeddings_file = 'bert_embeddings.pkl'
    if os.path.exists(embeddings_file):
        print("Loading BERT embeddings from cache...")
        with open(embeddings_file, 'rb') as f:
            embeddings = pickle.load(f)
    else:
        print("Generating BERT embeddings using SentenceTransformer...")
        model = SentenceTransformer('bert-base-nli-mean-tokens')
        embeddings = model.encode(tqdm(df['content'].tolist(), desc="Encoding with BERT"), show_progress_bar=True)
        with open(embeddings_file, 'wb') as f:
            pickle.dump(embeddings, f)
        print("BERT embeddings cached.")
    return np.asarray(embeddings)
				`,
			},
			{
				type: "html",
				value: `<h2>Initial Clustering Attempts</h2><p>To find patterns in our chats, I used clustering algorithms. My first attempt was with HDBScan, a clustering algorithm that's good for noisy data. To visualize the high-dimensional embeddings (768 dimensions), I reduced them to two dimensions using UMAP. The results, however, were disappointing:</p>`,
			},
			{
				type: "image",
				src: image1,
				alt: "Initial Discord Chat Clusters",
			},
			{
				type: "html",
				value: `<p>The clusters lacked meaningful structure, so I decided to try something else.</p><h2>Switching to K-Means and t-SNE</h2><p>Next, I tried K-Means, a simpler and more deterministic clustering algorithm. The algorithm works by:</p>`,
			},
			{
				type: "html",
				value: `<ol><li>Randomly initializing K cluster centers.</li><li>Assigning each point to the nearest cluster center.</li><li>Recalculating the cluster centers based on the assignments.</li><li>Repeating steps 2 and 3 until convergence.</li></ol>`,
			},
			{
				type: "html",
				value: `<p>For dimensionality reduction, I replaced UMAP with t-SNE, which preserves local relationships in the data. The combination of t-SNE and K-Means produced much better results:</p>`,
			},
			{
				type: "image",
				src: image2,
				alt: "K-Means and t-SNE Visualization",
			},
			{
				type: "html",
				value: `<h2>Moving to Gaussian Mixture Models (GMM)</h2><p>Although K-Means improved the clusters, it assumes that each cluster is spherical, which isn’t ideal for real-world data. To address this, I switched to Gaussian Mixture Models (GMMs). GMMs treat each cluster as a Gaussian distribution and use a probabilistic approach to assign points to clusters.</p>`,
			},
			{
				type: "html",
				value: `<p>Mathematically, GMMs model the data as:</p>$$P(X_i) = \\sum_{k=1}^K \\pi_k \\cdot \\mathcal{N}(X_i | \\mu_k, \\Sigma_k)$$`,
			},
			{
				type: "html",
				value: `<p>Where:</p><ul><li>\\(\\pi_k\\): Weight of the \\(k\\)-th cluster.</li><li>\\(\\mu_k\\): Mean of the \\(k\\)-th cluster.</li><li>\\(\\Sigma_k\\): Covariance matrix of the \\(k\\)-th cluster.</li></ul>`,
			},
			{
				type: "html",
				value: `<p>To optimize these parameters, GMMs use the Expectation-Maximization (EM) algorithm:</p>`,
			},
			{
				type: "html",
				value: `<ol><li><strong>E-step:</strong> Estimate the probability of each point belonging to each cluster.</li><li><strong>M-step:</strong> Update \\(\\pi_k\\), \\(\\mu_k\\), and \\(\\Sigma_k\\) to maximize the likelihood.</li></ol>`,
			},
			{
				type: "code",
				language: "python",
				value: `
def cluster_documents_gmm(tfidf_matrix, n_components=100, max_iter=100, tol=1e-4):
    """Cluster documents using Gaussian Mixture Models."""
    X = tfidf_matrix.toarray()
    kmeans = KMeans(n_clusters=n_components, random_state=42).fit(X)
    means = kmeans.cluster_centers_
    covariances = np.var(X, axis=0) + 1e-6
    weights = np.full(n_components, 1 / n_components)

    log_likelihood = 0

    for iteration in range(max_iter):
        # E-step
        log_prob = np.zeros((n_samples, n_components))
        for k in range(n_components):
            diff = X - means[k]
            exponent = -0.5 * np.sum((diff ** 2) / covariances, axis=1)
            log_prob[:, k] = np.log(weights[k] + 1e-10) - 0.5 * np.sum(np.log(2 * np.pi * covariances)) + exponent

        log_prob_norm = logsumexp(log_prob, axis=1)
        responsibilities = np.exp(log_prob - log_prob_norm[:, np.newaxis])

        # M-step
        Nk = responsibilities.sum(axis=0)
        weights = Nk / n_samples
        means = (responsibilities.T @ X) / Nk[:, np.newaxis]
        covariances = (responsibilities.T @ (X ** 2)) / Nk - means ** 2
        covariances = np.maximum(covariances, 1e-6)

        # Check for convergence
        new_log_likelihood = np.sum(log_prob_norm)
        if np.abs(new_log_likelihood - log_likelihood) < tol:
            break
        log_likelihood = new_log_likelihood

    labels = np.argmax(responsibilities, axis=1)
    return labels
				`,
			},
			{
				type: "html",
				value: `<p>The results with GMMs were the best so far, with more distinct and meaningful clusters:</p>`,
			},
			{
				type: "image",
				src: image3,
				alt: "Final Visualization with GMM",
			},
			{
				type: "html",
				value: `<h2>Conclusion</h2><p>This project was a great way to revisit years of conversations with a friend and explore clustering techniques. While the results aren’t perfect, they reveal clear patterns in our topics. All the code is available on <a href="https://github.com/ml5885/discord-chat-visualizer" target="_blank">GitHub</a>. There’s still room for improvement, but this was a fun start.</p>`,
			},
		],
	},
];
