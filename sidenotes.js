// Sidenotes float and clear each other, so a run of notes packed onto a few
// lines can only ever drift downward from the line that cites it. This lays
// them out instead as the ordered, non-overlapping arrangement that minimizes
// total squared distance from each note's citation line: isotonic regression
// via pool adjacent violators, after subtracting out the stacking offsets.
(function () {
	const GAP = 14;

	const content = document.querySelector(".blog-post .content");
	if (!content) return;
	const notes = Array.from(content.querySelectorAll(".sidenote, .marginnote"));
	if (!notes.length) return;

	// Least squares fit of a non-decreasing sequence to targets.
	function isotonic(targets) {
		const blocks = [];
		for (const t of targets) {
			let sum = t, count = 1;
			while (blocks.length) {
				const prev = blocks[blocks.length - 1];
				if (prev.sum * count <= sum * prev.count) break;
				blocks.pop();
				sum += prev.sum;
				count += prev.count;
			}
			blocks.push({ sum, count });
		}
		return blocks.flatMap((b) => Array(b.count).fill(b.sum / b.count));
	}

	function layout() {
		for (const note of notes) {
			note.style.position = "";
			note.style.top = "";
			note.style.left = "";
			note.style.width = "";
			note.style.marginTop = "";
		}
		if (getComputedStyle(notes[0]).display === "none") return;

		let base = content.getBoundingClientRect();
		const columns = notes.map((note) => {
			const rect = note.getBoundingClientRect();
			return {
				left: rect.left - base.left,
				width: rect.width,
				nudge: parseFloat(getComputedStyle(note).marginTop),
			};
		});

		// Out of flow with top:auto, each note sits at its static position: the
		// line box holding its citation, which is exactly where it wants to be.
		notes.forEach((note, i) => {
			note.style.position = "absolute";
			note.style.top = "auto";
			note.style.marginTop = "0";
			note.style.left = columns[i].left + "px";
			note.style.width = columns[i].width + "px";
		});

		base = content.getBoundingClientRect();
		const items = notes.map((note, i) => {
			const rect = note.getBoundingClientRect();
			const block = note.closest("p, blockquote, li, figure") || content;
			return {
				ideal: rect.top - base.top + columns[i].nudge,
				height: rect.height,
				// A note may rise to the top of its own paragraph, no further.
				floor: Math.max(0, block.getBoundingClientRect().top - base.top),
			};
		});

		// top[i+1] >= top[i] + height[i] + GAP becomes a plain monotonicity
		// constraint once each note's cumulative stacking offset is removed.
		const offsets = [];
		let acc = 0;
		for (const item of items) {
			offsets.push(acc);
			acc += item.height + GAP;
		}

		const fitted = isotonic(items.map((item, i) => item.ideal - offsets[i]));

		let floor = -Infinity;
		notes.forEach((note, i) => {
			floor = Math.max(floor, items[i].floor - offsets[i]);
			note.style.top = Math.max(fitted[i], floor) + offsets[i] + "px";
		});
	}

	let pending;
	function relayout() {
		cancelAnimationFrame(pending);
		pending = requestAnimationFrame(layout);
	}

	relayout();
	window.addEventListener("load", relayout);
	window.addEventListener("resize", relayout);
	document.fonts?.ready.then(relayout);
	window.MathJax?.startup?.promise.then(relayout);
})();
