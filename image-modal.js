/**
 * Image Modal Script for First Principles Blog
 *
 * This script provides modal functionality for images with the class 'clickable-img'.
 * When an image is clicked, it opens in a modal overlay that can be closed by clicking
 * anywhere on the overlay.
 *
 * Usage:
 * 1. Include this script in your HTML: <script src="../image-modal.js"></script>
 * 2. Add the class 'clickable-img' to any image you want to be clickable
 * 3. Ensure your CSS includes the modal styling (.modal-overlay, .modal-content)
 */

document.addEventListener("DOMContentLoaded", function () {
	const images = document.querySelectorAll(".clickable-img");

	images.forEach((img) => {
		img.addEventListener("click", function () {
			// Create modal overlay
			const overlay = document.createElement("div");
			overlay.className = "modal-overlay";

			// Create modal content container
			const modalContent = document.createElement("div");
			modalContent.className = "modal-content";

			// Create enlarged image
			const enlargedImg = document.createElement("img");
			enlargedImg.src = this.src;
			enlargedImg.alt = this.alt;

			// Assemble modal structure
			modalContent.appendChild(enlargedImg);
			overlay.appendChild(modalContent);
			document.body.appendChild(overlay);

			// Add focus management and keyboard support
			overlay.setAttribute("tabindex", "-1");
			overlay.focus();

			// Close modal on overlay click
			overlay.addEventListener("click", function (e) {
				if (e.target === overlay) {
					closeModal();
				}
			});

			// Close modal on Escape key
			overlay.addEventListener("keydown", function (e) {
				if (e.key === "Escape") {
					closeModal();
				}
			});

			function closeModal() {
				if (document.body.contains(overlay)) {
					document.body.removeChild(overlay);
				}
			}
		});
	});
});
