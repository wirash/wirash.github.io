const main = document.querySelector(".main");
const profileContainer = document.getElementById("profile-container");
const postContainer = document.getElementById("post-container");
const settingsToggle = document.getElementById("settings-toggle");
const settingsContainer = document.querySelector(".settings-container");
const settings = document.querySelector(".settings");
const settingsPaddingTop = document.querySelector(".padding.padding-top");
const tabContainer = document.querySelector(".tab-container");

let fully_displayed_observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				switch (entry.target) {
					case settingsPaddingTop:
						settingsContainer.toggleAttribute("open");
						break;
					case profileContainer:
					case postContainer:
						tabContainer
							.querySelector(
								`.tab:nth-child(${entry.target.getAttribute("nthchild")})`
							)
							.querySelector("input").checked = true;
						break;
				}
				// if (entry.target == settingsPaddingTop)
				// 	settingsContainer.toggleAttribute("open");
			}
		});
	},
	{
		root: null,
		rootMargin: "0px",
		threshold: 1.0,
	}
);

fully_displayed_observer.observe(settingsPaddingTop);
fully_displayed_observer.observe(profileContainer);
fully_displayed_observer.observe(postContainer);

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
