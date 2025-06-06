import image1 from "../images/file-6mBkAAnqEkE2hkR138PkiD.png";
import image2 from "../images/file-AJdFHbqZmAqYmfwsdy3wua.png";
import image3 from "../images/file-PFs5uw2yFWGHyuZLh26yda.png";
import image4 from "../images/discord-research-cluster.png";
import image5 from "../images/discord-bet-cluster.png";
import image6 from "../images/discord-join-cluster.png";

export interface BlogPost {
	id: string;
	title: string;
	date: string;
	authors: string[];
	content: Array<{ type: string; [key: string]: any }>;
}

export const blogPosts: BlogPost[] = [
	{
		id: "discord-clustering",
		title: "Visualizing Six Years of Discord Chats",
		date: "December 23, 2024",
		authors: ["Michael Li"],
		content: [
			{
				type: "html",
				value: `<p>My friend and I have been chatting on Discord almost daily since high school. Over the years, we've exchanged about 48,000 messages. I started wondering what kinds of things we've talked about most and whether there were any patterns in our conversations. This post covers how I downloaded, processed, and visualized our entire chat history.</p>`,
			},
			{
				type: "html",
				value: `<h2>Exporting the Chat History</h2><p>To start, I needed a way to export our messages from Discord. I looked into their API but didn't find an easy solution. Eventually, I discovered <a href="https://github.com/Tyrrrz/DiscordChatExporter" target="_blank">DiscordChatExporter</a>, an open-source tool that allowed me to download all our chat history into 47 JSON files containing around 45,000 messages. It worked perfectly.</p>`,
			},
			{
				type: "html",
				value: `<h2>Generating Message Embeddings</h2><p>Once I had the data, I needed a way to represent each message numerically. I decided to use BERT embeddings from the <code>sentence_transformers</code> library. Each message was converted into a 768-dimensional vector, capturing its semantic meaning. Here's the code I used:</p>`,
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
				value: `<h2>Moving to Gaussian Mixture Models (GMM)</h2><p>Although K-Means improved the clusters, it assumes that each cluster is spherical, which isn't ideal for real-world data. To address this, I switched to Gaussian Mixture Models (GMMs). GMMs treat each cluster as a Gaussian distribution and use a probabilistic approach to assign points to clusters.</p>`,
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
				value: `<h2>Rendering Thousands of Points</h2>
      <p>To show all the messages at once, I needed a frontend that wouldn't slow down with tens of thousands of points. I used an HTML canvas and a bit of D3 for zooming and panning. Canvas is more efficient than creating individual SVG elements, so it runs smoothly even at this scale. I also created a color palette, then used interpolation to expand it to more clusters. After that, I wrote a small seeded random function to shuffle the color list, so clusters that are similar don't get placed next to each other. I also added a highlight feature: clicking on a point dims all the other clusters, making it easier to focus on that one cluster alone. Finally, I added hover tooltips to show each message's text, author, and timestamp. This setup made it simple to explore the entire history without lag.</p>

      <p>Here's a small snippet from <code>script.js</code> that shows how I set up the canvas and draw each point. I'm redrawing everything on every zoom or pan event, which might sound expensive, but in practice it performs well. Because I'm using canvas, drawing tens of thousands of points remains responsive.</p>
      `,
			},
			{
				type: "code",
				language: "javascript",
				value: `      
const width = window.innerWidth;
const height = 800;
const pixelRatio = window.devicePixelRatio || 1;

const canvas = document.getElementById("chart");
canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;
canvas.style.width = width + "px";
canvas.style.height = height + "px";

const context = canvas.getContext("2d");
context.scale(pixelRatio, pixelRatio);

function drawPoints(data, transform) {
    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    data.forEach(d => {
        context.beginPath();
        context.arc(xScale(d.x), yScale(d.y), 3 / transform.k, 0, 2 * Math.PI);
        context.fillStyle = getColorForCluster(d.cluster_label);
        context.fill();
    });

    context.restore();
}

// Called inside a zoom handler:
d3.select(canvas).call(d3.zoom().on("zoom", event => {
    drawPoints(myData, event.transform);
}));
    `,
			},
			{
				type: "html",
				value: `<p>In this example, <code>xScale</code> and <code>yScale</code> are standard D3 linear scales, and <code>getColorForCluster</code> returns a color based on cluster label. I also have a tooltip system that listens for mouse events on the canvas to figure out which point I'm hovering over. This way, I can click to highlight a cluster, zoom in to examine smaller groups, and explore all the messages with ease.</p>`,
			},
			{
				type: "html",
				value: `<h2>Cluster Highlights</h2><p>With the canvas working, I had a lot of fun going through all the clusters. Some were straightforward, like the "Research" which contained all our messages about research. Some other clusters that caught my eye were "Bet," which I guess was a message we sent so frequently that it formed it's own cluster, and "Join", which just contained messages from my friend telling me to join our weekly calls over and over.</p>`,
			},
			{
				type: "image",
				src: image4,
				alt: "Research cluster in focus",
			},
			{
				type: "image",
				src: image5,
				alt: "Bet cluster in focus",
			},
			{
				type: "image",
				src: image6,
				alt: "Join cluster in focus",
			},
			{
				type: "html",
				value: `<h2>Conclusion</h2><p>This project was a great way to revisit years of conversations with a friend and explore clustering techniques. While the results aren't perfect, they reveal clear patterns in our topics. All the code is available on <a href="https://github.com/ml5885/discord-wrapped" target="_blank">GitHub</a>. There's still room for improvement, but this was a fun start.</p>`,
			},
		],
	},
	{
		id: "chomsky-on-chatgpt",
		title: "Conversation: Premise vs Implications",
		date: "May 25, 2025",
		authors: ["Tanush Chopra", "Michael Li"],
		content: [
			{
				type: "html",
				value: `<p>A conversation between two friends about Noam Chomsky's views on ChatGPT and what it means for AI and intelligence.</p>`,
			},
			{
				type: "html",
				value: `<div class="conversation">`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:25 PM</span><br><a href="https://chomsky.info/20230503-2/" target="_blank">https://chomsky.info/20230503-2/</a></div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:26 PM</span><br>Good takes?</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:27 PM</span><br>Yeah his main take is that ChatGPT is obviously better at humans by certain definitions, but also people who claim we've solved intelligence aren't right cause LLMs don't give us useful insights into intelligence since they're very hard to reverse engineer and interpret<br>I haven't read the entire thing yet<br>Also I see people say that Chomsky is out of touch, but based on this he clearly is not</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:28 PM</span><br>He mentions protein folding models for example</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:28 PM</span><br>Protein folding models as examples of good AI?</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:28 PM</span><br>As an example of AI that is useful for science</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:29 PM</span><br>Well people say he's out of touch because of a comment he said when gpt was first released</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:29 PM</span><br>What did he say</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:29 PM</span><br>He said GPT is nothing more than a statistical approximation of next word tokens and it's not really intelligent</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:30 PM</span><br>Which tbf still holds true</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:30 PM</span><br>Yeah that's true<br>But I guess people thought he meant that it wasn't useful?</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:30 PM</span><br>Yeah<br>Even an approximation for human language is still hella powerful</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:30 PM</span><br>Yeah he def makes a point to mention that AI is useful in this interview, especially what he calls AI engineering</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:34 PM</span><br>Thought this was new, this is actually from 2023</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:35 PM</span><br>I don't think anyone's doubting that LLMs are useful. What we're doubting is how useful it is. If it's the case that LLMs by being approximations of human cognition (by proxy of being approximations of language) then that means it can do a shit ton more than if it's just approximations for human language.</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:36 PM</span><br>At that point it's a neuroscience issue as we don't know how humans generate language or how we think<br>Hence we don't know if this model is an accurate model</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:36 PM</span><br>This is where Noam would disagree, relevant quote from article:<br>"It's true that chatbots cannot in principle match the linguistic competence of humans, for the reasons repeated above. Their basic design prevents them from reaching the minimal condition of adequacy for a theory of human language: distinguishing possible from impossible languages. Since that is a property of the design, it cannot be overcome by future innovations in this kind of AI. However, it is quite possible that future engineering projects will match and even surpass human capabilities, if we mean human capacity to act, performance. As mentioned above, some have long done so: automatic calculators for example. More interestingly, as mentioned, insects with minuscule brains surpass human capacities understood as competence."<br>E.g LLMs aren't learning good models of language</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:37 PM</span><br>What's interesting is that doesn't prevent them from being incredibly useful</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:38 PM</span><br>I would argue we're not talking about the same thing. I'm not saying whether it's a good model of language. I'm saying it's a model of human language and trying to explain the opinion regarding the relationship between human language and cognition while he's arguing about whether it's even a good model of human language.</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:38 PM</span><br>How is language and human language different<br>Language is man made?</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:39 PM</span><br>I'm just elucidating the opinions regarding language vs cognition</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:39 PM</span><br>What I'm saying is that Noam would disagree with the premise that LLMs learn models of language</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:39 PM</span><br>Not really worrying about the premise</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:40 PM</span><br>He's focused on premise while I'm focused on the implications of if the premise holds</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:40 PM</span><br>Yeah<br>I don't see what the confusion is</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:41 PM</span><br>I don't know if it is tbh but like BPE it's good enough<br>The confusion is whether a good approximation for human language is also a good approximation for human thought<br>That's where a large schism in the community comes from</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:42 PM</span><br>Yeah I agree with that</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Michael</strong> <span class="timestamp">— 5/25/25, 12:43 PM</span><br>But I think you and Noam are talking about the same thing broadly, since the premise is involved in both, like you can't leave out discussion of whether the premise is likely when discussing implications of that premise</div>`,
			},
			{
				type: "html",
				value: `<div class="message"><strong>Tanush</strong> <span class="timestamp">— 5/25/25, 12:44 PM</span><br>Well I think you can discuss the case of the premise being true and false without necessarily discussing the likelihood of the premise being true or not</div>`,
			},
			{
				type: "html",
				value: `</div>`,
			},
		],
	},
];
