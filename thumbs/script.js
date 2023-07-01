const filesInput = document.querySelector(".files-input");
const fileList = document.querySelector(".file-list");
const videoPlayer = document.querySelector(".video-player");
const playPauseControl = document.querySelector(".control.play-pause");
const timeInput = document.querySelector(".time-input");
const captureBtn = document.querySelector(".capture-btn");
const thumbnailPreview = document.querySelector(".thumbnail-preview");
const downloadBtn = document.querySelector(".download-btn");
const compress = document.querySelector(".compress");
const compressQuality = document.querySelector(".compress-quality");
const thumbnailResolution = document.querySelector(".thumbnail-resolution");
const useName = document.querySelector(".use-name");
const controlToBeginning = document.querySelector(".control.to-beginning");
const controlToEnd = document.querySelector(".control.to-end");
const batchDownloadBtn = document.querySelector(".batch-download-btn");
const clearFilesBtn = document.querySelector(".clear-files-btn");

filesInput.onchange = () => {
	const curFiles = event.currentTarget.files;

	document.body.classList.add("working");
	let promises = Array.from(curFiles).map(async (file) => {
		return new Promise((resolve, reject) => {
			const blobURL = window.URL.createObjectURL(file);
			let newFile = document.createElement("label");
			newFile.classList.add("file");
			newFile.innerHTML = `<input type="radio" name="file" />${file.name}`;
			newFile.videoUrl = blobURL;
			let name = file.name.replace(/\..+$/, "");
			newFile.videoName = name;
			newFile.querySelector("input").onchange = () => {
				if (event.currentTarget.checked) {
					videoPlayer.src = blobURL;
					videoPlayer.videoName = name;
				}
			};
			fileList.appendChild(newFile);
			resolve();
		});
	});
	Promise.allSettled(promises).then((results) => {
		document.body.classList.remove("working");
	});
	event.currentTarget.value = null;
};

videoPlayer.oncontextmenu = () => {
	event.preventDefault();
	event.stopPropagation();
};

videoPlayer.ontimeupdate = () => {
	timeInput.value = videoPlayer.currentTime;
};

videoPlayer.onpause = videoPlayer.onplay = () => {
	if (videoPlayer.paused) playPauseControl.classList.add("paused");
	else playPauseControl.classList.remove("paused");
};

playPauseControl.onclick = () => {
	if (videoPlayer.paused) videoPlayer.play();
	else videoPlayer.pause();
};

captureBtn.onclick = thumbnailResolution.onchange = () => {
	if (
		videoPlayer.src != "" &&
		!isNaN(videoPlayer.duration) &&
		videoPlayer.src != null
	) {
		var canvas = document.createElement("canvas");

		let w = videoPlayer.videoWidth;
		let h = videoPlayer.videoHeight;
		if (thumbnailResolution.value != "current") {
			let ratio = videoPlayer.videoWidth / videoPlayer.videoHeight;
			h = parseInt(thumbnailResolution.value);
			w = Math.round(h * ratio);
		}

		canvas.width = w;
		canvas.height = h;
		canvas.getContext("2d").drawImage(videoPlayer, 0, 0, w, h);
		const mimeType = compress.checked ? "image/webp" : "image/png";
		const quality = compressQuality.value;
		canvas.toBlob(
			function (blob) {
				let burl = URL.createObjectURL(blob);
				if (thumbnailPreview.src != "")
					URL.revokeObjectURL(thumbnailPreview.src);
				thumbnailPreview.src = burl;
				thumbnailPreview.videoName = videoPlayer.videoName;
				canvas.remove();
			},
			mimeType,
			quality
		);
	}
};

downloadBtn.onclick = () => {
	if (thumbnailPreview.src != "" && thumbnailPreview.src != null) {
		download(
			thumbnailPreview.src,
			useName.checked
				? thumbnailPreview.videoName
				: "thumbnail-" + thumbnailResolution.value + "p"
		);
	}
};

document.querySelectorAll(".control.min, .control.plus").forEach((control) => {
	control.onclick = () => {
		if (control.classList.contains("min"))
			videoPlayer.currentTime -= parseFloat(control.dataset?.time ?? 0);
		else if (control.classList.contains("plus"))
			videoPlayer.currentTime += parseFloat(control.dataset?.time ?? 0);
	};
});
controlToBeginning.onclick = () => {
	videoPlayer.currentTime = 0;
};
controlToEnd.onclick = () => {
	videoPlayer.currentTime = videoPlayer.duration;
};

batchDownloadBtn.onclick = () => {
	let files = document.querySelectorAll(".file");
	if (files.length == 0) return;

	document.body.classList.add("working");

	const mimeType = compress.checked ? "image/webp" : "image/png";
	const quality = compressQuality.value;
	const ext = compress.checked ? ".webp" : ".png";

	let ziparray = [];
	let promises = Array.from(files).map(async (file, index) => {
		return new Promise((resolve, reject) => {
			let tmpVidEl = document.createElement("video");
			tmpVidEl.addEventListener(
				"loadedmetadata",
				() => (tmpVidEl.currentTime = timeInput.value),
				false
			);
			tmpVidEl.addEventListener(
				"timeupdate",
				() => {
					let w = tmpVidEl.videoWidth;
					let h = tmpVidEl.videoHeight;
					if (thumbnailResolution.value != "current") {
						let ratio = tmpVidEl.videoWidth / tmpVidEl.videoHeight;
						h = parseInt(thumbnailResolution.value);
						w = Math.round(h * ratio);
					}
					var canvas = document.createElement("canvas");
					canvas.width = w;
					canvas.height = h;
					canvas.getContext("2d").drawImage(tmpVidEl, 0, 0, w, h);
					canvas.toBlob(
						function (blob) {
							let name =
								(useName.checked
									? file.videoName
									: "thumbnail-" + (index + 1)) + ext;
							ziparray.push({
								name,
								input: blob,
							});
							tmpVidEl.remove();
							canvas.remove();
							resolve();
						},
						mimeType,
						quality
					);
				},
				false
			);
			tmpVidEl.src = file.videoUrl;
		});
	});
	Promise.allSettled(promises).then((results) => {
		downloadZip(ziparray)
			.blob()
			.then((data) => {
				download(URL.createObjectURL(data), "thumbnails");
			});
		document.body.classList.remove("working");
	});
};

function download(url, name) {
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}

clearFilesBtn.onclick = () => {
	document.querySelectorAll(".file").forEach((file) => {
		URL.revokeObjectURL(file.videoUrl);
		file.remove();
	});
	videoPlayer.src = "";
	URL.revokeObjectURL(thumbnailPreview.src);
	thumbnailPreview.src = "";
};
