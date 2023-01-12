const tabContainer = document.querySelector(".tab-container");
const mainTabContainer = document.querySelector(".main-tab-container");
const newUserProfilePictureInput = document.querySelector(
	".new-user-profile-picture-input"
);
const newUserProfilePicture = document.querySelector(
	"table.add-user .profile-picture"
);
const usersSearchBtn = document.querySelector(".users-search-btn");
const usersSearchInput = document.querySelector(".users-search-input");
const attendanceSearchBtn = document.querySelector(".attendance-search-btn");
const attendanceSearchInput = document.querySelector(
	".attendance-search-input"
);
const usersDataTable = document.querySelector(".users-data");
const usersDataTableBody = document.querySelector(".users-data>tbody");
const attendanceDataTable = document.querySelector(".attendance-data");
const attendanceDataTableBody = document.querySelector(
	".attendance-data>tbody"
);
const clearBtn = document.querySelector(".clear-btn");
const addUserTable = document.querySelector(".add-user");
const logo = document.querySelector(".logo");
const uidInput = document.querySelector(".uid-input");
const uidGoBtn = document.querySelector(".uid-go-btn");
const uidReadClipboardBtn = document.querySelector(".uid-read-clipboard-btn");
const createUserBtn = document.querySelector(".create-user-btn");
const usersRefreshBtn = document.querySelector(".users-refresh-btn");
const attendanceRefreshBtn = document.querySelector(".attendance-refresh-btn");
let userContainer = document.querySelector(".user-container");

const dingAudio = new Audio("ding.mp3");

tabContainer.querySelectorAll(".tab").forEach((tab, index) => {
	tab.querySelector("input[type=radio").onchange = () => {
		mainTabContainer.children[index].scrollIntoView();
	};
});

const fileTypes = [
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
];

function validFileType(file) {
	return fileTypes.includes(file.type);
}

function returnFileSize(number) {
	if (number < 1024) {
		return `${number} bytes`;
	} else if (number >= 1024 && number < 1048576) {
		return `${(number / 1024).toFixed(1)} KB`;
	} else if (number >= 1048576) {
		return `${(number / 1048576).toFixed(1)} MB`;
	}
}

newUserProfilePictureInput.onchange = selectProfilePicture;

function selectProfilePicture() {
	const curFiles = event.currentTarget.files;
	if (curFiles.length != 0) {
		let file = curFiles[0];
		let profilePicture = event.currentTarget.closest(".profile-picture");
		if (validFileType(file) && file.size <= 8000000) {
			revokeUDPURL(profilePicture);
			profilePicture.style = `
			--furl: url('${URL.createObjectURL(file)}');
			--fname: '${file.name}';
			--fsize: '${returnFileSize(file.size)}';
			`;
		} else {
			profilePicture.classList.add("invalid");
			setTimeout(() => {
				profilePicture.classList.remove("invalid");
			}, 1001);
		}
	}
}

function searchInTable(searchInput, table) {
	if (searchInput.validity.patternMismatch) return;
	if (searchInput.value == "") {
		table.removeAttribute("search");
		table.querySelectorAll("tbody>tr").forEach((tr) => {
			tr.removeAttribute("hidden");
		});
	} else {
		let query = searchInput.value.toLowerCase();
		let trs = table.querySelectorAll("tbody>tr");
		let trsVisible = 0;
		trs.forEach((tr) => {
			let username =
				tr.querySelector(".username>input")?.value.toLowerCase() ??
				tr.querySelector(".username").innerText.toLowerCase();
			let surname =
				tr.querySelector(".surname>input")?.value.toLowerCase() ??
				tr.querySelector(".surname").innerText.toLowerCase();
			let name =
				tr.querySelector(".name>input")?.value.toLowerCase() ??
				tr.querySelector(".name").innerText.toLowerCase();
			if (
				!(
					username.includes(query) ||
					surname.includes(query) ||
					name.includes(query)
				)
			)
				tr.setAttribute("hidden", "");
			else {
				tr.removeAttribute("hidden");
				trsVisible++;
			}
		});
		table.setAttribute(
			"search",
			`Searched for '${query}': Showing ${trsVisible} out of ${trs.length} rows`
		);
	}
}

usersSearchBtn.onclick = usersSearchInput.onsearch = searchInTable.bind(
	null,
	usersSearchInput,
	usersDataTable
);
attendanceSearchBtn.onclick = attendanceSearchInput.onsearch =
	searchInTable.bind(null, attendanceSearchInput, attendanceDataTable);

clearBtn.onclick = () => {
	addUserTable.querySelectorAll("input").forEach((item) => {
		item.value = null;
	});
	revokeUDPURL(newUserProfilePicture);
	newUserProfilePicture.removeAttribute("style");
};

logo.onclick = () => {
	location.reload();
};

function revokeUDPURL(profilePicture) {
	URL.revokeObjectURL(profilePicture.style.getPropertyValue("--furl"));
}

uidGoBtn.addEventListener("click", checkUserAccess);

function readClipboardForUID(playSound) {
	try {
		navigator.clipboard.readText().then((clipText) => {
			if (
				clipText.startsWith("am4m#") &&
				clipText.length == 21 &&
				clipText != "am4m#" + uidInput.value
			) {
				uidInput.value = clipText;
				if (playSound == true) dingAudio.play();
				checkUserAccess();
			}
		});
	} catch (err) {
		alert("Clipboard not supported or access is denied!");
	}
}
uidReadClipboardBtn.onclick = readClipboardForUID;
// let uidClipboardLoop = setInterval(() => {
// 	readClipboardForUID(true);
// }, 3000);

createUserBtn.onclick = () => {
	let username = addUserTable.querySelector("td.username>input").value;
	let surname = addUserTable.querySelector("td.surname>input").value;
	let name = addUserTable.querySelector("td.name>input").value;
	let expires = addUserTable.querySelector("td.expires>input").value;
	let dp = newUserProfilePictureInput.files[0];

	if (
		username === "" ||
		surname === "" ||
		name === "" ||
		expires === "" ||
		!dp ||
		!new RegExp("^" + "[a-z.]{3,20}" + "$").test(username) ||
		!new RegExp("^" + "[A-zÀ-ž][A-zÀ-ž ]{3,20}" + "$").test(surname) ||
		!new RegExp("^" + "[A-zÀ-ž][A-zÀ-ž ]{3,20}" + "$").test(name)
	) {
		alert("Please fill in everything correctly and select a profile picture");
		return;
	}

	let form = new FormData();
	form.append("username", username);
	form.append("surname", surname);
	form.append("name", name);
	form.append("expires", expires);
	form.append("dp", dp);

	createUserBtn.setAttribute("busy", "");

	$.ajax({
		type: "POST",
		url: "assets/php/create_user.php",
		processData: false,
		contentType: false,
		enctype: "multipart/form-data",
		cache: false,
		data: form,
		success: function (response) {
			createUserBtn.setAttribute("busy", "success");
		},
		error: function (response) {
			createUserBtn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => createUserBtn.removeAttribute("busy"), 1000);
		},
	});
};

function resetUserPassword() {
	let btn = event.currentTarget;
	let uid = btn.closest("tr").querySelector("td.uid").innerText;
	if (!uid || uid == "") {
		alert("UID not found");
		return;
	}
	if (
		!confirm(
			"Reset selected user's password?\n(user will be logged out and will have to create a new password)"
		)
	)
		return;

	btn.setAttribute("busy", "");

	$.ajax({
		type: "POST",
		url: "assets/php/reset_user_password.php",
		data: {
			uid,
		},
		success: function (response) {
			btn.setAttribute("busy", "success");
		},
		error: function (response) {
			btn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => btn.removeAttribute("busy"), 1000);
		},
	});
}

function deleteUser() {
	let btn = event.currentTarget;
	let row = btn.closest("tr");
	let uid = row.querySelector("td.uid").innerText;
	if (!uid || uid == "") {
		alert("UID not found");
		return;
	}
	if (
		!confirm(
			"Are you sure you want to delete this user?\n(WARNING: this action is permanent and cannot be undone!)"
		)
	)
		return;

	btn.setAttribute("busy", "");

	$.ajax({
		type: "POST",
		url: "assets/php/delete_user.php",
		data: {
			uid,
		},
		success: function (response) {
			btn.setAttribute("busy", "success");
			setTimeout(() => row.remove(), 1500);
		},
		error: function (response) {
			btn.setAttribute("busy", "error");
		},
	});
}

function saveUserChanges() {
	let btn = event.currentTarget;
	let row = btn.closest("tr");

	let usernameInput = row.querySelector("td.username>input");
	let surnameInput = row.querySelector("td.surname>input");
	let nameInput = row.querySelector("td.name>input");
	let expiresInput = row.querySelector("td.expires>input");
	let statusSelect = row.querySelector("select.status");
	let dpLabel = row.querySelector("label.profile-picture");
	let dpInput = row.querySelector(".profile-picture-input");

	let uid = row.querySelector("td.uid").innerText;
	let username = usernameInput.value;
	let surname = surnameInput.value;
	let name = nameInput.value;
	let expires = expiresInput.value;
	let status = statusSelect.value;
	let dp = dpInput.files[0];

	if (
		uid === "" ||
		username === "" ||
		surname === "" ||
		name === "" ||
		expires === "" ||
		status === "" ||
		!new RegExp("^" + "[a-z.]{3,20}" + "$").test(username) ||
		!new RegExp("^" + "[A-zÀ-ž][A-zÀ-ž ]{3,20}" + "$").test(surname) ||
		!new RegExp("^" + "[A-zÀ-ž][A-zÀ-ž ]{3,20}" + "$").test(name)
	) {
		alert("Some fields contain invalid values.");
		return;
	} else {
		let noChanges =
			[usernameInput, surnameInput, nameInput, expiresInput].forEach(
				(input) => {
					if (input.value == input.getAttribute("value")) return true;
				}
			) ||
			statusSelect.value ==
				statusSelect.querySelector("option[selected]").value;
		if (noChanges) {
			alert("No changes were detected.");
			return;
		}
	}

	if (
		!confirm(
			"Do you want to save changes?\n(if username is changed, user will be logged out and will have to login using their new username)"
		)
	)
		return;

	let form = new FormData();
	form.append("uid", uid);
	form.append("username", username);
	form.append("surname", surname);
	form.append("name", name);
	form.append("expires", expires);
	form.append("status", status);
	if (dp) form.append("dp", dp);

	btn.setAttribute("busy", "");

	$.ajax({
		type: "POST",
		url: "assets/php/save_user_changes.php",
		processData: false,
		contentType: false,
		enctype: "multipart/form-data",
		cache: false,
		data: form,
		success: function (response) {
			[usernameInput, surnameInput, nameInput, expiresInput].forEach(
				(input) => {
					input.setAttribute("value", input.value);
				}
			);
			statusSelect
				.querySelector("option[selected]")
				.removeAttribute("selected");
			statusSelect
				.querySelector("option[value=" + status + "]")
				.setAttribute("selected", "");
			if (dp) {
				dpInput.value = null;
				dpLabel.style.setProperty("--fname", "");
				dpLabel.style.removeProperty("--fsize");
			}

			btn.setAttribute("busy", "success");
		},
		error: function (response) {
			btn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => btn.removeAttribute("busy"), 1000);
		},
	});
}

usersRefreshBtn.onclick = () => {
	usersRefreshBtn.setAttribute("busy", "");
	$.ajax({
		type: "POST",
		url: "assets/php/fetch_users.php",
		data: {},
		success: function (response) {
			usersDataTableBody.innerHTML = response;

			//add profile picture change event
			usersDataTableBody
				.querySelectorAll(".profile-picture-input")
				.forEach((profilePictureInput) => {
					profilePictureInput.onchange = selectProfilePicture;
				});

			//add action button events
			usersDataTableBody
				.querySelectorAll(".actions-container>button.action:first-child")
				.forEach((button) => {
					button.onclick = resetUserPassword;
				});
			usersDataTableBody
				.querySelectorAll(".actions-container>button.action:nth-child(2)")
				.forEach((button) => {
					button.onclick = deleteUser;
				});
			usersDataTableBody
				.querySelectorAll(".actions-container>button.action:last-child")
				.forEach((button) => {
					button.onclick = saveUserChanges;
				});

			usersRefreshBtn.setAttribute("busy", "success");
		},
		error: function (response) {
			usersRefreshBtn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => usersRefreshBtn.removeAttribute("busy"), 1000);
		},
	});
};
// usersRefreshBtn.click();

attendanceRefreshBtn.onclick = () => {
	attendanceRefreshBtn.setAttribute("busy", "");
	$.ajax({
		type: "POST",
		url: "assets/php/fetch_attendance.php",
		data: {},
		success: function (response) {
			attendanceDataTableBody.innerHTML = response;
			attendanceRefreshBtn.setAttribute("busy", "success");
		},
		error: function (response) {
			attendanceRefreshBtn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => attendanceRefreshBtn.removeAttribute("busy"), 1000);
		},
	});
};
// attendanceSearchBtn.click();

function allowUserAccess() {
	let uid = event.currentTarget.getAttribute("uid");
	if (!uid || uid == "" || uid.length != 16 || !/^\d+$/.test(uid)) return;

	let btn = event.currentTarget;
	btn.setAttribute("busy", "");
	$.ajax({
		type: "POST",
		url: "assets/php/allow_user_access.php",
		data: { uid },
		success: function (response) {
			btn.setAttribute("busy", "success");
			setTimeout(() => {
				btn.previousElementSibling.style =
					"--c: darkorange; --access-content: 'Access Granted Temporarily'";
				btn.remove();
			}, 1001);
		},
		error: function (response) {
			btn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => btn?.removeAttribute("busy"), 1000);
		},
	});
}

function checkUserAccess() {
	if (uidGoBtn.hasAttribute("busy")) return;

	let val = uidInput.value.includes("#") ? uidInput.value.split("#")[1] : null;
	if (val != null) uidInput.value = val;

	let imgudp = userContainer.querySelector("img.udp");
	if (
		uidInput.value == "" ||
		uidInput.value.length != 16 ||
		uidInput.validity.patternMismatch ||
		!/^\d+$/.test(uidInput.value) ||
		(imgudp && uidInput.value == imgudp.getAttribute("uid"))
	)
		return;

	uidGoBtn.setAttribute("busy", "");
	$.ajax({
		type: "POST",
		url: "assets/php/fetch_user_access.php",
		data: { uid: uidInput.value },
		success: function (response) {
			userContainer.innerHTML = response;
			let aabtn = userContainer.querySelector("button.allow-access");
			if (aabtn) aabtn.onclick = allowUserAccess;
			uidGoBtn.setAttribute("busy", "success");
		},
		error: function (response) {
			userContainer.replaceChildren();
			uidGoBtn.setAttribute("busy", "error");
		},
		complete: function (data) {
			setTimeout(() => uidGoBtn.removeAttribute("busy"), 1000);
		},
	});
}
uidInput.onsearch = checkUserAccess;
