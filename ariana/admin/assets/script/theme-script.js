let theme;

var dom_observer = new MutationObserver(function (mutation) {
	if (document.body) {
		theme = localStorage.getItem("theme") ?? "light"; //default = light
		if (theme) document.body.setAttribute("theme", theme);

		dom_observer.disconnect();
	}
});

var container = document.documentElement;
dom_observer.observe(container, {
	attributes: false,
	childList: true,
	characterData: false,
});

window.addEventListener(
	"DOMContentLoaded",
	function () {
		const themeToggleInput = document.querySelector(".theme-toggle-input");
		themeToggleInput.checked = theme == "dark" ? true : false;

		themeToggleInput.onchange = () => {
			if (themeToggleInput.checked) {
				document.body.setAttribute("theme", "dark");
				localStorage.setItem("theme", "dark");
			} else {
				document.body.setAttribute("theme", "light");
				localStorage.setItem("theme", "light");
			}
		};
	},
	{ once: true }
);
