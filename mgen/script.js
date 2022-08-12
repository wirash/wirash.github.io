maquetteB = `
        <div class="content" type="B">
          <div class="c tl">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c tr">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c br">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c bl">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
        </div>`;

const maquette = document.createElement("div");
maquette.classList.add("maquette");
maquette.style = "display:grid";
maquette.innerHTML = "<button>+ B</button><button>+ S</button>";

const bcolArr = [
  "lightblue",
  "lightgoldenrodyellow",
  "lightgreen",
  "lightsalmon",
  "lightcoral",
  "lightseagreen",
  "lightpink",
  "lightslategrey",
];

const fInnerHTML = "<a></a><wb></wb><wf></wf>";
const vInnerHTML = "<a></a>";
const vbInnerHTML = "<a></a><i></i>";

const signClasses = [
  "circle-tri",
  "diam-diam",
  "tri-flipped",
  "tri-i",
  "tri-plus",
  "tri-x",
];

let r = document.querySelector(":root");
const gsize = document.getElementById("gsize");
const pmargin = document.getElementById("pmargin");
const mborder = document.getElementById("mborder");
const fsize = document.getElementById("fsize");
const awidth = document.getElementById("awidth");
const asize = document.getElementById("asize");
const cmc = document.getElementById("cmc");
const emc = document.getElementById("emc");
const imc = document.getElementById("imc");
const mprint = document.getElementById("mprint");
const settings = document.querySelector(".settings");
let pages = document.querySelectorAll("page");
const draw_empty_maquettes = document.getElementById("draw_empty_maquettes");
const pagecount_current = document.querySelector("#page-count > .current");
const pagecount_total = document.querySelector("#page-count > .total");
const insert_blank_page = document.getElementById("insert_blank_page");
const psize = document.getElementById("psize");
const porientation = document.getElementById("porientation");
const settings_container = document.querySelector(".settings_container");
const toggler = document.querySelector(".toggler");
const instructions = document.getElementById("instructions");
const about = document.querySelector(".about");
const mce_downloader = document.getElementById("mce_downloader");
var observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting === true) {
      pagecount_current.innerText =
        Array.prototype.indexOf.call(pages, entries[0].target) + 1;
    }
  },
  { threshold: [0.5] }
);
observer.observe(pages[0]);

gsize.onkeypress = () => {
  if (event.key === "Enter") {
    let counts = getGridItemCount();
    if (!isNaN(counts[0])) {
      r.style.setProperty("--grid-h", counts[1]);
      r.style.setProperty("--grid-v", counts[2]);
      //generateGridItems(counts[0], counts[0]);
    }
  }
};

function getGridItemCount() {
  let value = gsize.value.split("x");
  let v1 = parseInt(value[0]);
  let v2 = parseInt(value[1]);
  return [v1 * v2, v1, v2];
}

pmargin.onkeypress = () => {
  if (event.key === "Enter") {
    r.style.setProperty("--pmargin", event.target.value);
  }
};

mborder.onchange = () => {
  if (event.target.checked)
    r.style.setProperty("--mborder", "1px solid var(--color3)");
  else r.style.setProperty("--mborder", "none");
};

fsize.onkeypress = () => {
  if (event.key === "Enter") {
    r.style.setProperty("--fsize", event.target.value);
  }
};

awidth.onkeypress = () => {
  if (event.key === "Enter") {
    r.style.setProperty("--awidth", event.target.value);
  }
};
asize.onkeypress = () => {
  if (event.key === "Enter") {
    r.style.setProperty("--asize", event.target.value);
  }
};

function getMC() {
  let strArr = [];
  document.querySelectorAll(".content").forEach((item) => {
    let strArrM = [];
    item.querySelectorAll(".c").forEach((item2) => {
      let strArrC = [];
      item2.querySelectorAll("div:not(.sign)").forEach((item3) => {
        if (item3.hasChildNodes()) {
          let ldr = item3
            .getAttribute("class")
            .replace("v ", "")
            .replace("f ", "")
            .replace("b ", "");
          strArrC.push(ldr + "." + item3.querySelector("a").innerText);
        } else {
          strArrC.push("");
        }
      });

      //for sign
      let signclass = item2.querySelector("div.sign").classList[1];
      if(signclass) strArrC.push(signclass);

      strArrM.push(strArrC.join(","));
    });
    strArr.push(
      strArrM.join(";") +
        "@" +
        (item.hasAttribute("restart-c") ? "true" : "") +
        "|" +
        item.getAttribute("type")
    );
  });
  return strArr.join("\r\n");
}

cmc.onclick = () => {
  let str = getMC();
  if (str != "") {
    navigator.clipboard.writeText(str).then(() => {
      alert("Maquette Codes copied to clipboard");
    });
  }
};

function download(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  mce_downloader.setAttribute("href", url);
  mce_downloader.setAttribute("download", filename);
  mce_downloader.click();
}

emc.onclick = () => {
  let str = getMC();
  if (str != "") {
    download(str, "text/plain", "Maquette Codes Export");
  }
};

imc.onclick = () => {
  if (confirm("Overwrite current Maquette Codes?")) {
    setTimeout(() => {
      navigator.clipboard
        .readText()
        .then((text) => {
          let strArr = text.split("\r\n");
          generateGridItems(strArr.length);
          // let inputs = document.querySelectorAll("page input");
          // if (inputs.length > 0) {
          //   strArr.forEach((item, index) => {
          //     inputs[index].value = item;
          //     inputs[index].dispatchEvent(
          //       new KeyboardEvent("keypress", {
          //         key: "Enter",
          //       })
          //     );
          //   });
          //   console.log("Maquette Codes imported from clipboard");
          // }
          document.querySelectorAll(".maquette").forEach((item, index) => {
            if (!strArr[index]) return;
            const b = item.querySelector("button");
            if (b) b.click();
            let strArrH1 = strArr[index].split("|");
            let strArrH2 = strArrH1[0].split("@");
            let strArrC = strArrH2[0].split(";");
            let c = item.querySelector(".content");
            if (strArrH2[1] == "true") c.toggleAttribute("restart-c");
            c.setAttribute("type", strArrH1[1] ?? "B");
            item.querySelectorAll(".c").forEach((item2, index2) => {
              let strArrD = strArrC[index2].split(",");
              item2.querySelectorAll("div:not(.sign)").forEach((item3, index3) => {
                if (!strArrD[index3].includes(".")) return;
                let strArrE = strArrD[index3].split(".");
                if (!item3.hasChildNodes()) item3.click();
                item3.classList.remove("d");
                item3.classList.add(strArrE[0]);
                item3.querySelector("a").innerText = strArrE[1];
              });

              //for sign
              let last = strArrD.pop();
              if(signClasses.includes(last)) item2.querySelector("div.sign").classList.add(last);
            });
          });
        })
        .catch((err) => {
          alert("Failed to read Maquette Codes from clipboard");
          console.error(err);
        });
    }, 1000);
  }
};

psize.onchange = () => {
  pages.forEach((page) => {
    page.setAttribute("size", psize.value);
  });
};
porientation.onchange = () => {
  pages.forEach((page) => {
    page.setAttribute("layout", porientation.value);
  });
};

toggler.onclick = () => {
  settings_container.toggleAttribute("open");
};

about.onclick = () => {
  instructions.showModal();
};

function createPages(count) {
  if (count <= 0) return;

  let newpage = document.createElement("page");
  newpage.setAttribute("size", psize.value);
  newpage.setAttribute("layout", porientation.value);
  newpage.innerHTML = "<div class='maquettecontainer'></div>";

  for (let i = 1; i <= count; i++) {
    let newnewpage = newpage.cloneNode(true);
    document.body.insertBefore(newnewpage, settings);
    observer.observe(newnewpage);
    setPageEvents(newnewpage);
  }
  pages = document.querySelectorAll("page");
  pagecount_total.innerText = pages.length;
  //return pages;
}

mprint.onclick = () => {
  if (pages[0].querySelectorAll(".maquette:not([default])").length >= 1)
    window.print();
  else alert("No maquettes available to print");
};

draw_empty_maquettes.onclick = () => {
  let r_new = window.getComputedStyle(document.documentElement);
  let v = parseInt(r_new.getPropertyValue("--grid-v"));
  let h = parseInt(r_new.getPropertyValue("--grid-h"));
  generateGridItems(v * h * pages.length, v * h);
};

insert_blank_page.onclick = () => {
  createPages(1);
};

function generateGridItems(count, gic) {
  gic = gic ?? getGridItemCount()[0];
  pages = document.querySelectorAll("page");
  let newpages = Math.ceil(count / gic) - pages.length;
  if (newpages >= 0) {
    createPages(newpages);
    pages.forEach((page) => {
      let l = page.querySelectorAll(".maquette").length;
      // page.innerHTML = "";
      let mc = page.querySelector(".maquettecontainer");
      for (let i = 1; i <= gic - l; i++) {
        let m2 = maquette.cloneNode(true);
        setButtonEvents(m2);
        m2.toggleAttribute("default");
        mc.appendChild(m2);
      }
    });
  }
}

// set button events
function setButtonEvents(m) {
  m.querySelectorAll("button").forEach((item) => {
    item.addEventListener("click", () => {
      m.removeAttribute("style");
      m.removeAttribute("default");
      m.innerHTML = maquetteB;
      setEvents(m);
    });
  });
  m.querySelector("button:last-child").addEventListener("click", () => {
    m.querySelector(".content").setAttribute("type", "S");
  });
}

//set v,f event
function setEvents(m) {
  m.querySelector(".content").oncontextmenu = () => {
    event.preventDefault();
    const t = event.target;
    if (t.classList.contains("content")) {
      // let txt = prompt("Enter a name for the selected Maquette");
      // if (txt != null && txt != "") {
      //   t.setAttribute("name", txt);
      // }
      t.toggleAttribute("restart-c");
    }
  };
  m.querySelectorAll(".c").forEach((item) => {
    item.oncontextmenu = () => {
      event.preventDefault();
      const t = event.target;
      if (t.classList.contains("c")) {
        t.classList.remove("zw");
        t.classList.toggle("no");
      }
    };
    item.onmousedown = () => {
      if (event.button === 1) {
        event.preventDefault();
        const t = event.target;
        if (t.classList.contains("c")) {
          t.classList.remove("no");
          t.classList.toggle("zw");
        }
      }
    };
  });
  m.querySelectorAll(".c > div.sign").forEach((item) => {
    item.onclick = () => {
      const t = event.target;
      if (t.classList.length == 1) t.classList.add(signClasses[0]);
      else t.classList.remove(t.classList[1]);
    };
    item.oncontextmenu = () => {
      event.preventDefault();
      const t = event.target;
      if (t.classList.length > 1) {
        let currClass = t.classList[1];
        t.classList.remove(currClass);
        let ind = signClasses.indexOf(currClass) + 1;
        t.classList.add(signClasses[ind < 6 ? ind : 0]);
      }
    };
  });
  m.querySelectorAll(".c > div:not(.sign)").forEach((item) => {
    item.onclick = () => {
      const t = event.target;
      if (t.hasChildNodes()) t.replaceChildren();
      else {
        t.classList.remove("l", "r");
        if (t.classList.contains("f")) t.innerHTML = fInnerHTML;
        else if (t.classList.contains("v")) {
          if (t.classList.contains("b")) t.innerHTML = vbInnerHTML;
          else t.innerHTML = vInnerHTML;
        }
        t.classList.add("d");
      }
    };
    item.oncontextmenu = () => {
      event.preventDefault();
      const t = event.target;
      if (t.hasChildNodes()) {
        if (t.classList.contains("d")) {
          t.classList.toggle("d");
          t.classList.add("l");
        } else if (t.classList.contains("l")) {
          t.classList.toggle("l");
          t.classList.add("r");
        } else if (t.classList.contains("r")) {
          t.classList.toggle("r");
          t.classList.add("d");
        }
      }
    };
    item.onmousedown = () => {
      if (event.button === 1) {
        event.preventDefault();
        const t = event.target;
        if (t.hasChildNodes()) {
          let txt = prompt("Enter a name for the selected vehicle");
          if (txt != null && txt != "") {
            if (txt.length <= 3) t.querySelector("a").innerText = txt;
            else alert("Name cannot be longer than 3 characters");
          }
        }
      }
    };
    if (item.classList.contains("v"))
      item.style.setProperty("--bcol", bcolArr.random());
  });
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function setPageEvents(p) {
  //document.querySelectorAll("page").forEach((item) => {
  p.onclick = () => {
    const t = event.target;
    if (t.tagName == "PAGE") {
      let h = t.clientHeight * 0.1;
      if (event.offsetY < h) {
        if (event.shiftKey) t.removeAttribute("name_top");
        else {
          let txt = prompt(
            "Enter a text for the top of the page",
            t.getAttribute("name_top") ?? ""
          );
          if (txt != null && txt != "") t.setAttribute("name_top", txt);
        }
      } else if (event.offsetY >= h) {
        if (event.shiftKey) t.removeAttribute("name_middle");
        else {
          let txt = prompt(
            "Enter a text for the middle of the page",
            t.getAttribute("name_middle") ?? ""
          );
          if (txt != null && txt != "") t.setAttribute("name_middle", txt);
        }
      }
      // console.log(event);
    }
  };
  //});
}

setPageEvents(pages[0]);
