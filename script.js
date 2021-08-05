const { PDFDocument } = PDFLib;
window.arrayOfPdf = [];
var input = document.getElementById("pdf-file");

function openfile(evt) {
  addFiles(input.files);
}

async function addFiles(files) {
  for (var i = 0; i < files.length; i++) {
    fileData = new Blob([files[i]]);
    // Pass getBuffer to promise.
    var promise = (i) => new Promise(getBuffer(fileData));
    await promise(i)
      .then(function (data) {
        window.arrayOfPdf.push({
          bytes: data,
          name: files[i].name,
        });
        listFilesOnScreen();
      })
      .catch(function (err) {
        console.log("Error: ", err);
      });
  }
}

function getBuffer(fileData) {
  return function (resolve) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = function () {
      var arrayBuffer = reader.result;
      var bytes = new Uint8Array(arrayBuffer);
      resolve(bytes);
    };
  };
}

function listFilesOnScreen() {
  $(".pdf-file").remove();
  if (window.arrayOfPdf.length > 0) {
    $.each(window.arrayOfPdf, function (i, v) {
      $(".list-files").append(`<div class="pdf-file">
           <div onclick="moveLeft(this.parentElement)" class="btn-remove move">&#10094;</div>
           <div onclick="removePdf(this.parentNode)" class="btn-remove">&times;</div>
           <div onclick="moveRight(this.parentElement)" class="btn-remove move">&#10095;</div>
           <img/>
           <br><br>
           <span title="${v.name}">${v.name}</span></div>`);
    });
  }
  if (window.arrayOfPdf.length > 1) {
    mergeBtn.removeAttribute("disabled");
  } else {
    mergeBtn.setAttribute("disabled", "");
  }
}

function removePdf(el) {
  var i = Array.from(el.parentNode.children).indexOf(el);
  window.arrayOfPdf.splice(i, 1);
  //listFilesOnScreen();
  if (arrayOfPdf.length <= 1) mergeBtn.setAttribute("disabled", "");
  el.remove();
}

async function joinPdf() {
  if (arrayOfPdf.length <= 1) return;
  const mergedPdf = await PDFDocument.create();
  for (let document of window.arrayOfPdf) {
    document = await PDFDocument.load(document.bytes);
    const copiedPages = await mergedPdf.copyPages(
      document,
      document.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  var pdfBytes = await mergedPdf.save();
  download(
    pdfBytes,
    "mergedpdf" + new Date().getTime() + ".pdf",
    "application/pdf"
  );
}

input.addEventListener("change", openfile, false);

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  var files = [];
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        files.push(file);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      files.push(ev.dataTransfer.files[i]);
    }
  }

  if (files.length > 0) addFiles(files);
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function moveLeft(el) {
  if (el.previousElementSibling) {
    var i = Array.from(el.parentNode.children).indexOf(el);
    swapArrayElements(arrayOfPdf, i, i - 1);

    el.previousElementSibling.insertAdjacentElement("beforebegin", el);
  }
}
function moveRight(el) {
  if (el.nextElementSibling) {
    var i = Array.from(el.parentNode.children).indexOf(el);
    swapArrayElements(arrayOfPdf, i, i + 1);

    el.nextElementSibling.insertAdjacentElement("afterend", el);
  }
}

function swapArrayElements(a, x, y) {
  if (a.length === 1) return a;
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
}
