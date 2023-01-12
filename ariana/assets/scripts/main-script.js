const main = document.querySelector(".main");
const profileContainer = document.getElementById("profile-container");
const postContainer = document.getElementById("post-container");
const workoutsContainer = document.getElementById("workouts-container");
const settingsToggle = document.getElementById("settings-toggle");
const settingsContainer = document.querySelector(".settings-container");
const settings = document.querySelector(".settings");
const settingsPaddingTop = document.querySelector(".padding.padding-top");
const tabContainer = document.querySelector(".tab-container");
const currentGymStatCountdown = document.querySelector(
	".current-gym-stat .countdown"
);
const currentGymStatMin = document.querySelector(".current-gym-stat-min");

let observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				switch (entry.target) {
					case settingsPaddingTop:
						settingsContainer.toggleAttribute("open");
						break;
					case profileContainer:
					case postContainer:
					case workoutsContainer:
						tabContainer.querySelector(
							`.tab:nth-child(${entry.target.getAttribute("nthchild")}) input`
						).checked = true;
						break;
					case currentGymStatCountdown:
						currentGymStatMin.setAttribute("hidden", "");
						break;
				}
			} else {
				switch (entry.target) {
					case currentGymStatCountdown:
						currentGymStatMin.removeAttribute("hidden");
						break;
				}
			}
		});
	},
	{
		root: null,
		rootMargin: "0px",
		threshold: 1,
	}
);

// let fully_hidden_observer = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 		});
// 	},
// 	{
// 		root: null,
// 		rootMargin: "0px",
// 		threshold: 1,
// 	}
// );

observer.observe(settingsPaddingTop);
observer.observe(currentGymStatCountdown);

document.querySelectorAll(".tab").forEach((tab) => {
	tab.addEventListener(
		"click",
		() => {
			document
				.getElementById(event.currentTarget.dataset.href)
				?.scrollIntoView();
		},
		{ passive: true }
	);
});

document.querySelectorAll(".main>div").forEach((container) => {
	observer.observe(container);
});

// postContainer.scrollIntoView();

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

document.querySelectorAll(".close-overlay-btn").forEach((btn) => {
	btn.onclick = () => {
		btn.closest(".overlay").removeAttribute("open");
	};
});

document
	.querySelectorAll(".overlay>.padding.padding-middle")
	.forEach((padding) => {
		padding.onclick = () => {
			padding.closest(".overlay").removeAttribute("open");
		};
	});

document.querySelectorAll(".context-menu>*").forEach((cmenu) => {
	cmenu.addEventListener("click", () => {
		cmenu.closest(".toggle").blur();
	});
});

settingsToggle.addEventListener("click", () => {
	settingsContainer.toggleAttribute("open");
	settingsContainer.scrollTop = document.body.offsetHeight ?? 0;
});
