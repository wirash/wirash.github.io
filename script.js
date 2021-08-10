(function auto_dark_mode() {
  var hr = new Date().getHours();
  (hr >= 19 || hr <= 7) && document.body.toggleAttribute("darkmode");
})();

// const { PDFDocument } = PDFLib;
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

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
        //listFilesOnScreen();
      })
      .then(() => {
        addFileOnScreen(files[i]);
      })
      .catch(function (err) {
        console.log("Error: ", err);
      });
  }
  // listFilesOnScreen();
  updateSelectedPdf();
}

function updateSelectedPdf() {
  if ($(".list-files > .pdf-file[selected]").length == 0) {
    $(".list-files > .pdf-file:first-child").attr("selected", "");
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

// function listFilesOnScreen() {
//   $(".pdf-file").remove();
//   if (window.arrayOfPdf.length > 0) {
//     $.each(window.arrayOfPdf, function (i, v) {
//       $(".list-files").append(`<div class="pdf-file">
//            <div onclick="moveLeft(this.parentElement)" class="btn-remove move">&#10094;</div>
//            <div onclick="removePdf(this.parentNode)" class="btn-remove">&times;</div>
//            <div onclick="moveRight(this.parentElement)" class="btn-remove move">&#10095;</div>
//            <img/>
//            <br>
//            <span title="${
//              v.name
//            }">${v.name.split(".").slice(0, -1).join(".")}</span></div>`);
//     });
//   }
//   if (window.arrayOfPdf.length > 1) {
//     mergeBtn.removeAttribute("disabled");
//   } else {
//     mergeBtn.setAttribute("disabled", "");
//   }
// }
function addFileOnScreen(file) {
  $(".list-files")
    .append(`<div class="pdf-file" onclick="$('.pdf-file').removeAttr('selected');this.toggleAttribute('selected')">
           <div onclick="moveLeft(this.parentElement);event.stopPropagation()" class="btn-remove move">&#10094;</div>
           <div onclick="removePdf(this.parentNode);event.stopPropagation()" class="btn-remove">&times;</div>
           <div onclick="moveRight(this.parentElement);event.stopPropagation()" class="btn-remove move">&#10095;</div>
           <img/>
           <br>
           <span title="${file.name}">${file.name
    .split(".")
    .slice(0, -1)
    .join(".")}</span></div>`);
}

function removePdf(el) {
  var i = Array.from(el.parentNode.children).indexOf(el);
  window.arrayOfPdf.splice(i, 1);
  //listFilesOnScreen();
  el.classList.add("removing");
  setTimeout(() => {
    el.remove();
    updateSelectedPdf();
  }, 300);
}

async function mergePdf() {
  if (arrayOfPdf.length <= 1) {
    alert("At least 2 PDF files are needed to be able merge!");
    return;
  }
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
    "mergedpdf_" + new Date().getTime() + ".pdf",
    "application/pdf"
  );
}

async function splitPdf(el) {
  var selel = document.querySelector(".pdf-file[selected]");
  if (selel) {
    var lbl = el.querySelector("input:checked + label");
    if (!lbl) return;
    var splitArray = [];

    var ind = Array.from(selel.parentNode.children).indexOf(selel);
    let document = await PDFDocument.load(arrayOfPdf[ind].bytes);
    var pageIndices = document.getPageIndices();

    switch (lbl.getAttribute("for")) {
      case "o1":
        var iValue = lbl.querySelector("input").value;
        if (pageIndices.length <= iValue) {
          alert(`The selected PDF does not have more than ${iValue} pages!`);
          return;
        }
        var arr = Array.from({ length: iValue }, (x, i) => i);
        splitArray.push(arr);
        splitArray.push(pageIndices.filter((x) => !arr.includes(x)));
        break;
      case "o2":
        var iValue = lbl.querySelector("input").value;
        if (pageIndices <= iValue) {
          alert(`The selected PDF does not have more than ${iValue} pages!`);
          return;
        }
        splitArray = [...chunks(pageIndices, parseInt(iValue))];
        break;
      case "o3":
        pageIndices
          .filter((n) => (n + 1) % 2)
          .forEach((item) => {
            splitArray.push([item]);
          });
        break;
      case "o4":
        pageIndices
          .filter((n) => n % 2)
          .forEach((item) => {
            splitArray.push([item]);
          });
        break;
      case "o5":
        var iValue = lbl.querySelector("input").value;
        iValue != "" &&
          iValue.split(",").forEach((item) => {
            !isNaN(item) && splitArray.push([item - 1]);
          });
        break;
    }
    console.log(splitArray);
    // return;
    // for (var a = 0; a > 0; a++) {
    splitArray.forEach(async (item, index) => {
      var splitPdf = await PDFDocument.create();
      var copiedPages = await splitPdf.copyPages(document, item);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      var pdfBytes = await splitPdf.save();
      download(
        pdfBytes,
        "split" + (index + 1) + "_" + new Date().getTime() + ".pdf",
        "application/pdf"
      );
    });
  }
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

async function extractPages(el) {
  var selel = document.querySelector(".pdf-file[selected]");
  if (selel) {
    var ind = Array.from(selel.parentNode.children).indexOf(selel);

    let document = await PDFDocument.load(arrayOfPdf[ind].bytes);
    var pageIndices = document.getPageIndices();
    var extractedPages = await PDFDocument.create();

    var extractArray = [];
    var iValue = el.querySelector("input").value;
    iValue != "" &&
      iValue.split(",").forEach((item) => {
        !isNaN(item) &&
          pageIndices.includes(item - 1) &&
          extractArray.push(item - 1);
      });
    if (extractArray.length == 0) {
      alert("PDF does not contain given page number values!");
      return;
    }

    var copiedPages = await extractedPages.copyPages(document, extractArray);
    copiedPages.forEach((page) => extractedPages.addPage(page));

    var pdfBytes = await extractedPages.save();
    download(
      pdfBytes,
      "extractedPages" + "_" + new Date().getTime() + ".pdf",
      "application/pdf"
    );
  }
}

function getSplitArray(part, indices) {
  var arr = Array.from({ length: xv.value }, (x, i) => i);
  return part == 0 ? arr : indices.filter((x) => !arr.includes(x));
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

function hideAllPopups(popup_container, event) {
  if (event.target == popup_container || event.target.tagName == "BUTTON") {
    popup_container.setAttribute("hidden", "");
    $(".popup").attr("hidden", "");
  }
}

async function removePages(el) {
  var selel = document.querySelector(".pdf-file[selected]");
  if (selel) {
    var ind = Array.from(selel.parentNode.children).indexOf(selel);

    let document = await PDFDocument.load(arrayOfPdf[ind].bytes);
    var pageIndices = document.getPageIndices();
    var remainingPages = await PDFDocument.create();

    var removeArray = [];
    var iValue = el.querySelector("input").value;
    iValue != "" &&
      iValue.split(",").forEach((item) => {
        console.log(item);
        !isNaN(item) &&
          pageIndices.includes(item - 1) &&
          removeArray.push(item - 1);
      });
    if (removeArray.length == 0) {
      alert("PDF does not contain given page number values!");
      return;
    }

    var copiedPages = await remainingPages.copyPages(
      document,
      pageIndices.filter((x) => !removeArray.includes(x))
    );
    copiedPages.forEach((page) => remainingPages.addPage(page));

    var pdfBytes = await remainingPages.save();
    download(
      pdfBytes,
      "remainingPages" + "_" + new Date().getTime() + ".pdf",
      "application/pdf"
    );
  }
}

async function rotatePages(el) {
  var selel = document.querySelector(".pdf-file[selected]");
  if (selel) {
    var ind = Array.from(selel.parentNode.children).indexOf(selel);

    let document = await PDFDocument.load(arrayOfPdf[ind].bytes);
    var pageIndices = document.getPageIndices();
    var rotatedPages = await PDFDocument.create();

    var rotateArray = [];
    var iValue = el.querySelector("input[type='text']").value;
    if (iValue == "") rotateArray = pageIndices;
    iValue != "" &&
      iValue.split(",").forEach((item) => {
        console.log(item);
        !isNaN(item) &&
          pageIndices.includes(item - 1) &&
          rotateArray.push(item - 1);
      });
    if (rotateArray.length == 0) {
      alert("PDF does not contain given page number values!");
      return;
    }
    var r_angle = el.querySelector("input[type='number']").value;
    if (isNaN(r_angle)) return;
    if (r_angle % 90 != 0) {
      alert(`${r_angle} is not a multiple of 90!`);
      return;
    }
    var copiedPages = await rotatedPages.copyPages(document, pageIndices);
    copiedPages.forEach((page, index) => {
      // console.log(page.getRotation().angle);
      rotateArray.includes(index) &&
        page.setRotation(degrees(-90 + parseInt(r_angle)));
      rotatedPages.addPage(page);
    });
    var pdfBytes = await rotatedPages.save();
    download(
      pdfBytes,
      "rotatedPages" + "_" + new Date().getTime() + ".pdf",
      "application/pdf"
    );
  }
}
