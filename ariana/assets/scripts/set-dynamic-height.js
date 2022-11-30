//for dynamic vh, fixes 100vh bug/problem in chrome because of top bar
let timeoutId = null;
const setDynamicHeight = () => {
	clearTimeout(timeoutId); // avoid execution of previous timeouts
	timeoutId = setTimeout(() => {
		const doc = document.documentElement;
		doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
	}, 200);
};
window.addEventListener("resize", setDynamicHeight, { passive: true });
setDynamicHeight();
