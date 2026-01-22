(function () {
	// Create the container for the toggle
	const container = document.createElement("div");
	container.className = "toggle-container-fixed";

	// Toggle Button HTML
	container.innerHTML = `
        <button class="toggle-button-small" id="toggleBtn" aria-label="Toggle shape">
            <svg class="shape-small" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path class="morph-path" id="morphPath"></path>
            </svg>
        </button>
    `;

	document.body.appendChild(container);

	// Add styles dynamically (or we could put this in styles.css)
	const style = document.createElement("style");
	style.textContent = `
        .toggle-container-fixed {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 1000;
        }
        .toggle-button-small {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            transition: transform 0.2s ease;
            width: 80px;
            height: 80px;
        }
        .toggle-button-small:hover { transform: scale(1.05); }
        .toggle-button-small:active { transform: scale(0.95); }
        .shape-small {
            width: 100%;
            height: 100%;
            display: block;
            overflow: visible;
            cursor: pointer;
        }
        .morph-path {
            fill: #fff;
            stroke: #000;
            stroke-width: 3;
            stroke-linejoin: round;
            transition: fill 0.3s ease;
            cursor: pointer;
        }
        .toggle-button-small:hover .morph-path { fill: #f5f5f5; }
        .title-label-small {
            margin-top: 4px;
            font-size: 12px;
            color: #333;
            font-weight: bold;
            font-family: var(--font-body);
        }
    `;
	document.head.appendChild(style);

	// Logic
	const morphPath = document.getElementById("morphPath");
	const toggleBtn = document.getElementById("toggleBtn");

	let isKiki = true;
	let animationDelay = 70;

	function scalePath(path, scale) {
		return path.replace(/[\d.-]+/g, (num) =>
			(100 + (parseFloat(num) - 100) * scale).toFixed(1),
		);
	}

	// Frames from test.html
	const kiki =
		"M 145,20 L 125,85 L 185,100 L 135,115 L 160,165 L 110,135 L 105,190 L 90,135 L 35,160 L 75,115 L 20,85 L 85,95 L 75,50 L 105,85 Z";
	const bouba =
		"M 123.6,16.2 C 121.3,16.6 119,17.9 117.1,19.4 C 115.2,20.8 113.7,23 112.2,24.9 C 110.7,26.8 109.4,28.9 108.1,31 C 106.8,33.1 105.6,35.2 104.5,37.3 C 103.3,39.5 102.3,42 101.2,43.8 C 100,45.6 98.7,48.4 97.5,48 C 96.2,47.7 94.9,43.9 93.7,41.8 C 92.5,39.7 91.3,37.5 90.1,35.4 C 88.9,33.3 87.9,31.1 86.5,29.1 C 85.1,27.1 83.5,25.1 81.7,23.5 C 79.8,21.9 77.8,20.3 75.6,19.3 C 73.3,18.4 70.8,18 68.4,17.8 C 65.9,17.6 63.1,17.8 60.7,18.2 C 58.3,18.6 55.9,19.1 53.7,20.2 C 51.5,21.2 49.3,22.7 47.6,24.3 C 45.8,26 44.2,27.8 43.2,29.9 C 42.2,32 41.5,34.7 41.6,37.1 C 41.8,39.4 43.1,41.7 44.2,43.8 C 45.3,46 46.7,48 48.4,49.9 C 50,51.8 52.1,53.5 54,55.2 C 55.9,56.8 57.8,58.2 59.7,59.7 C 61.7,61.3 63.7,62.8 65.6,64.4 C 67.5,66 69.4,67.7 71.4,69.4 C 73.3,71.1 75.6,72.6 77.1,74.4 C 78.6,76.2 81.1,79 80.5,80.1 C 79.8,81.2 75.5,81 73,81.1 C 70.5,81.2 67.9,80.9 65.4,80.7 C 62.8,80.5 60.4,80.1 57.9,79.8 C 55.4,79.5 53,79.1 50.5,78.7 C 48.1,78.3 45.7,77.9 43.2,77.5 C 40.7,77.2 38.2,77 35.7,76.8 C 33.2,76.6 30.6,76.4 28,76.4 C 25.5,76.4 22.8,76.4 20.4,76.8 C 17.9,77.1 15,77.2 13.3,78.6 C 11.5,79.9 10.4,82.5 10,84.8 C 9.6,87.1 9.9,90.1 10.8,92.3 C 11.6,94.5 13.4,96.8 15.2,98.2 C 17,99.7 19.4,100.3 21.7,101 C 24,101.6 26.5,101.8 29,102.1 C 31.5,102.5 34,102.7 36.5,102.9 C 39,103.1 41.6,103.2 44.2,103.3 C 46.7,103.4 49.3,103.6 51.8,103.7 C 54.4,103.8 56.9,104 59.5,104.1 C 62,104.2 64.9,103.9 67.2,104.5 C 69.4,105 73.2,106.2 73.3,107.4 C 73.3,108.5 69.4,110.4 67.3,111.6 C 65.2,112.8 63,113.7 60.8,114.6 C 58.6,115.6 56.3,116.4 54.1,117.4 C 51.9,118.4 49.7,119.4 47.5,120.5 C 45.4,121.6 43.1,122.6 41.2,124.1 C 39.3,125.5 37.3,127.3 36.2,129.3 C 35.1,131.4 34.7,134.1 34.6,136.5 C 34.5,138.9 35.1,141.5 35.7,143.9 C 36.4,146.2 37.3,148.4 38.5,150.6 C 39.7,152.7 41.3,154.7 42.9,156.5 C 44.6,158.4 46.2,160.8 48.3,161.9 C 50.4,163.1 53.1,163.4 55.5,163.4 C 57.9,163.4 60.4,162.8 62.7,161.9 C 64.9,161.1 67,159.7 69,158.3 C 71,156.9 72.9,155.2 74.9,153.6 C 76.8,152 78.8,150.5 80.8,148.9 C 82.7,147.3 84.8,145.1 86.6,144.2 C 88.4,143.3 90.4,142.5 91.6,143.5 C 92.8,144.5 93.2,148.1 93.9,150.3 C 94.7,152.6 95.5,154.9 96.3,157.2 C 97.1,159.5 97.8,161.8 98.6,164.1 C 99.5,166.3 100.4,168.5 101.4,170.8 C 102.3,173 103,175.4 104.3,177.3 C 105.7,179.3 107.4,181.5 109.5,182.6 C 111.6,183.6 114.4,183.7 116.9,183.8 C 119.3,183.8 121.9,183.3 124.4,183 C 126.9,182.7 129.4,182.5 131.7,181.8 C 134,181.1 136.6,180.2 138.2,178.6 C 139.8,176.9 141,174.3 141.2,172 C 141.4,169.7 140.3,167.1 139.5,164.9 C 138.6,162.6 137.3,160.5 136.1,158.4 C 134.9,156.3 133.5,154.3 132.3,152.2 C 131,150.1 128.3,146.8 128.7,145.9 C 129,144.9 132.4,145.7 134.4,146.3 C 136.5,146.9 138.7,148.4 141,149.4 C 143.2,150.4 145.4,151.2 147.6,152.1 C 149.9,153 152.1,154 154.3,154.9 C 156.6,155.7 158.8,157 161.2,157.2 C 163.6,157.4 166.6,157.2 168.5,156 C 170.5,154.9 172.4,152.4 172.8,150.2 C 173.3,148 172.1,145.2 171.2,143.1 C 170.2,140.9 168.7,139.1 167.2,137.1 C 165.7,135.2 163.9,133.2 162.2,131.4 C 160.5,129.5 158.8,127.7 157.1,125.9 C 155.4,124 153.6,122.1 151.8,120.2 C 150.1,118.3 148.2,116.5 146.9,114.5 C 145.6,112.5 143.4,109.7 144.1,108.2 C 144.7,106.8 148.5,106.4 150.8,105.7 C 153.2,105 155.6,104.6 158,104.1 C 160.4,103.6 162.9,103.4 165.4,102.9 C 167.8,102.5 170.2,102 172.5,101.4 C 174.9,100.8 177.3,100.3 179.6,99.4 C 181.8,98.5 184.2,97.5 185.9,95.9 C 187.7,94.3 189.5,92.1 190,89.9 C 190.5,87.6 189.8,84.7 189.2,82.4 C 188.6,80 187.5,77.9 186.3,75.8 C 185,73.7 183.5,71.6 181.8,69.8 C 180.2,67.9 178.2,66 176.2,64.5 C 174.2,63 172.2,61.3 169.9,60.8 C 167.6,60.2 164.8,60.5 162.6,61.1 C 160.3,61.8 158.3,63.4 156.3,64.8 C 154.3,66.3 152.4,68.1 150.5,69.8 C 148.7,71.5 147,73.5 145.1,75.2 C 143.3,76.9 141.4,79 139.3,79.9 C 137.2,80.8 134,81.5 132.5,80.5 C 131,79.5 130.5,76.2 130.3,73.9 C 130,71.5 130.7,68.8 131,66.4 C 131.4,63.9 132.1,61.6 132.6,59.2 C 133.1,56.8 133.3,54.3 133.8,51.8 C 134.2,49.4 134.9,47.1 135.3,44.7 C 135.8,42.2 136.2,39.8 136.5,37.3 C 136.8,34.8 137,32.2 136.9,29.7 C 136.8,27.1 137.1,24.3 136.1,22.1 C 135.2,20 133.2,18 131.1,17 C 129,16 126,15.9 123.6,16.2 Z";
	const middle1 =
		"M 138,35 L 122,85 L 175,98 L 132,112 L 152,155 L 110,130 L 105,178 L 92,130 L 45,152 L 78,112 L 30,88 L 82,95 L 75,62 L 102,85 Z";
	const middle2 =
		"M 102,85 Q 150,15 122,85 Q 200,98 132,112 Q 170,170 110,130 Q 105,200 92,130 Q 30,170 78,112 Q 10,85 82,95 Q 65,50 102,85 Z";
	const middle3 = scalePath(bouba, 0.8);

	const kikiToBoubaFrames = [kiki, middle1, middle2, middle3, bouba];
	const boubaToKikiFrames = [bouba, middle3, middle2, middle1, kiki];

	function animateTransition(frames, callback) {
		let currentFrameIndex = 0;
		function showNextFrame() {
			if (currentFrameIndex < frames.length) {
				morphPath.setAttribute("d", frames[currentFrameIndex]);
				currentFrameIndex++;
				setTimeout(showNextFrame, animationDelay);
			} else {
				if (callback) callback();
			}
		}
		showNextFrame();
	}

	const storedTheme = localStorage.getItem("theme");

	if (storedTheme === "kiki") {
		isKiki = true;
		document.body.classList.add("theme-kiki");
		morphPath.setAttribute("d", kiki);
	} else {
		isKiki = false;
		document.body.classList.remove("theme-kiki");
		morphPath.setAttribute("d", bouba);
	}

	toggleBtn.addEventListener("click", () => {
		toggleBtn.disabled = true;
		if (isKiki) {
			// Switch to Bouba
			animateTransition(kikiToBoubaFrames, () => {
				toggleBtn.disabled = false;
			});
			document.body.classList.remove("theme-kiki");
			localStorage.setItem("theme", "bouba");
			isKiki = false;
		} else {
			// Switch to Kiki
			animateTransition(boubaToKikiFrames, () => {
				toggleBtn.disabled = false;
			});
			document.body.classList.add("theme-kiki");
			localStorage.setItem("theme", "kiki");
			isKiki = true;
		}
	});
})(); // End IIFE
