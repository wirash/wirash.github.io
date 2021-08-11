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
      .then(async function (data) {
        window.arrayOfPdf.push({
          bytes: data,
          name: files[i].name,
          size: returnFileSize(files[i].size),
          pagecount: await getNumPages(data),
        });
        //listFilesOnScreen();
      })
      .then(() => {
        addFileOnScreen(arrayOfPdf[arrayOfPdf.length - 1]);
      })
      .catch(function (err) {
        //console.log("Error: ", err);
        alert(err);
      });
  }
  // listFilesOnScreen();
  updateSelectedPdf();
}

async function getNumPages(arrayBuffer) {
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + "bytes";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(0) + " kB";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + " MB";
  }
}

function updateSelectedPdf() {
  if ($(".list-files > .pdf-file[selected]").length == 0) {
    $(".list-files > .pdf-file:first-child").attr("selected", "");
  }
}

function getBuffer(fileData) {
  return function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = function () {
      var arrayBuffer = reader.result;
      var bytes = new Uint8Array(arrayBuffer);

      //check if valid pdf using signatures
      //https://en.wikipedia.org/wiki/List_of_file_signatures
      var validPdf_sig = [0x25, 0x50, 0x44, 0x46, 0x2d];
      var bytes_sig = bytes.slice(0, 5);
      //if all first 5 elements are equal then return bytes else error
      if (bytes_sig.every((v, i) => v === validPdf_sig[i])) resolve(bytes);
      else {
        reject("Selected file is not a valid PDF file!");
      }
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
    .append(`<div class="pdf-file" onclick="$('.pdf-file').removeAttr('selected');this.toggleAttribute('selected')" size="${
    file.size
  }, ${file.pagecount} pages">
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
    alert("At least 2 PDF files are needed to merge into one!");
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

    var iValue = parseInt(lbl.querySelector("input")?.value);
    switch (lbl.getAttribute("for")) {
      case "o1":
        if (isNaN(iValue) || iValue == 0) return;
        if (pageIndices.length <= iValue) {
          alert(`The selected PDF does not have more than ${iValue} pages!`);
          return;
        }
        var arr = Array.from({ length: iValue }, (x, i) => i);
        splitArray.push(arr);
        splitArray.push(pageIndices.filter((x) => !arr.includes(x)));
        break;
      case "o2":
        if (isNaN(iValue) || iValue == 0) return;
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
        if (isNaN(iValue) || iValue == 0) return;
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

async function protectPdf() {
  var selel = document.querySelector(".pdf-file[selected]");
  if (selel) {
    var ind = Array.from(selel.parentNode.children).indexOf(selel);

    let document = await PDFDocument.load(arrayOfPdf[ind].bytes);
    var protectedPages = await PDFDocument.create();
    var copiedPages = await protectedPages.copyPages(
      document,
      document.getPageIndices()
    );
    copiedPages.forEach(async (page, index) => {
      protectedPages.addPage(page);
      const [embeddedPage] = await protectedPages.embedPdf(document, [index]);

      page.drawPage(embeddedPage, {
        x: page.getWidth(),
        y: 0,
        xScale: 1,
        yScale: 1,
        rotate: degrees(90),
        opacity: 1,
      });
    });

    var pdfBytes = await protectedPages.save();
    download(
      pdfBytes,
      "protectedPages" + "_" + new Date().getTime() + ".pdf",
      "application/pdf"
    );
  }
}
