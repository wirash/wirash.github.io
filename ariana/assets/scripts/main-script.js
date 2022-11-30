const main = document.querySelector(".main");
const postContainer = document.getElementById("post-container");

document.querySelectorAll(".tab").forEach((tab) => {
	tab.addEventListener(
		"click",
		() => {
			let el = event.target.classList.contains("tab")
				? event.target
				: event.target.closest(".tab");
			document.getElementById(el.dataset.href)?.scrollIntoView();
		},
		{ passive: true }
	);
});

postContainer.scrollIntoView();

// let last_known_scroll_position = 0;
// let ticking = false;
// document.querySelector(".main").addEventListener(
// 	"scroll",
// 	() => {
// 		last_known_scroll_position = window.scrollY;

// 		if (!ticking) {
// 			requestAnimationFrame(() => {
// 				ticking = false;
// 			});

// 			ticking = true;
// 		}
// 	},
// 	{ passive: true }
// );
