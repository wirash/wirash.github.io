maquetteB = `
        <div class="content" type="B">
          <div class="c tl">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="f b"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c tr">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="f b"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c br">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="f b"></div>
            <div class="v b"></div>
            <div class="sign"></div>
          </div>
          <div class="c bl">
            <div class="f"></div>
            <div class="v"></div>
            <div class="v"></div>
            <div class="f b"></div>
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
  "orange",
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

const cornersArr = ["tl", "tr", "br", "bl"];

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
const imct = document.getElementById("imct");
const imcj = document.getElementById("imcj");
const emcj = document.getElementById("emcj");
const imch = document.getElementById("imch");
const emch = document.getElementById("emch");
const watermark = document.getElementById("watermark");
const watermark_text = document.getElementById("wmtext");
const watermark_text_fontsize = document.getElementById("wmtextfs");
const show_watermark = document.getElementById("show_watermark");

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

function maquettesToText() {
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
      if (signclass) strArrC.push(signclass);

      //for no + zw + vp
      let no = item2.classList.contains("no") ? "1" : "0";
      let zw = item2.classList.contains("zw") ? "1" : "0";
      let vp = item2.classList.contains("vp") ? "1" : "0";

      strArrM.push(strArrC.join(",") + "#" + no + "," + zw + "," + vp);
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

function maquettesToJSON() {
  let main = {
    pages: [],
  };
  pages.forEach((page) => {
    let tmp_page = {
      text_top: page.getAttribute("text_top") ?? null,
      text_middle: page.getAttribute("text_middle") ?? null,
      maquettes: [],
    };
    page.querySelectorAll(".content").forEach((content) => {
      let tmp_maquette = {
        type: content.getAttribute("type") ?? "S",
        restart_count: content.hasAttribute("restart-c"),
        corners: {},
      };
      content.querySelectorAll(".c").forEach((corner, index) => {
        let tmp_corner = {
          has_zw: corner.classList.contains("zw"),
          has_no: corner.classList.contains("no"),
          has_vp: corner.classList.contains("vp"),
          has_inrit_s: corner.classList.contains("inrit-s"),
          has_inrit_b: corner.classList.contains("inrit-b"),
          has_fp: corner.classList.contains("fp"),
          sign: corner.querySelector("div.sign").classList[1] ?? null,
          vehicles: [],
        };
        corner.querySelectorAll("div:not(.sign)").forEach((vehicle) => {
          let tmp_vehicle = null;
          if (vehicle.hasChildNodes())
            tmp_vehicle = {
              direction: vehicle
                .getAttribute("class")
                // .replace("v ", "")
                // .replace("f ", "")
                // .replace("b ", "")
                // .replace("fb ", ""),
                .replaceAll(" ", "")
                .replace("v", "")
                .replace("f", "")
                .replaceAll("b", ""),
              text: vehicle.querySelector("a").innerText,
              is_fb: vehicle.classList.contains("fb"),
            };
          tmp_corner.vehicles.push(tmp_vehicle);
        });
        //tmp_maquette.corners.push(tmp_corner);
        tmp_maquette.corners[cornersArr[index]] = tmp_corner;
      });
      tmp_page.maquettes.push(tmp_maquette);
    });
    main.pages.push(tmp_page);
  });
  return main;
}

function maquettesToHTML() {
  let html = "";
  pages.forEach((page) => {
    html += page.outerHTML;
  });
  return html;
}

cmc.onclick = () => {
  let str = maquettesToText();
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
  let str = maquettesToText();
  if (str != "") {
    download(str, "text/plain", "Maquette Codes Export");
  }
};

emcj.onclick = () => {
  let json = maquettesToJSON();
  if (json) {
    download(JSON.stringify(json), "json/plain", "Maquette Codes Export.json");
  }
};

emch.onclick = () => {
  let html = maquettesToHTML();
  if (html != "") {
    download(html, "html/plain", "Maquette Codes Export.html");
  }
};

function textToMaquettes(text) {
  let strArr = text.split("\r\n");
  generateGridItems(strArr.length);
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
      let strArrD1 = strArrC[index2].split("#");
      let strArrD = strArrD1[0].split(",");
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
      if (signClasses.includes(last))
        item2.querySelector("div.sign").classList.add(last);

      //for no + zw + vp
      let nozwvp = strArrD1[1]?.split(",");
      if (nozwvp) {
        if (nozwvp[0] == "1") item2.classList.add("no");
        else if (nozwvp[1] == "1") item2.classList.add("zw");
        else if (nozwvp[2] == "1") item2.classList.add("vp");
      }
    });
  });
}

function jsonToMaquettes(text) {
  let main = JSON.parse(text);

  let maquette_count = Object.values(main.pages).reduce(
    (acc, { maquettes }) => acc + maquettes.length,
    0
  );
  generateGridItems(maquette_count);

  main.pages.forEach((page, index0) => {
    let maquettes = page.maquettes;
    let cp = pages[index0]; //current page
    if (page.text_top) cp.setAttribute("text_top", page.text_top);
    if (page.text_middle) cp.setAttribute("text_middle", page.text_middle);
    let acm = cp.querySelectorAll(".maquette"); //all current page maquettes
    maquettes.forEach((maquette, index) => {
      let cm = acm[index]; //current maquette
      let acmb = cm.querySelectorAll("button"); //all current maquette buttons
      if (maquette.type == "B") acmb[0].click();
      else acmb[1].click();
      let content = cm.querySelector(".content");
      if (maquette.restart_count == true) content.toggleAttribute("restart-c");
      let ccs = Object.values(maquette.corners); //current corners
      cm.querySelectorAll(".c").forEach((c, index2) => {
        let cc = ccs[index2]; //current corner
        c.querySelectorAll("div:not(.sign)").forEach((v, index3) => {
          let cv = cc.vehicles[index3]; //current vehicle
          if (!cv) return;
          if (!v.hasChildNodes()) v.click();
          v.classList.remove("d");
          v.classList.add(cv.direction);
          if (cv.is_fb) v.classList.add("fb");
          v.querySelector("a").innerText = cv.text;
        });

        //for sign
        if (cc.sign) c.querySelector("div.sign").classList.add(cc.sign);

        //for no + zw + vp
        if (cc.has_no) c.classList.add("no");
        else if (cc.has_zw) c.classList.add("zw");
        else if (cc.has_vp) c.classList.add("vp");
        else if (cc.has_inrit_s) c.classList.add("inrit-s");
        else if (cc.has_inrit_b) c.classList.add("inrit-b");
        else if (cc.has_fp) c.classList.add("fp");
      });
    });
  });
}

function htmlToMaquettes(text) {
  pages.forEach((item) => {
    item.remove();
  });
  document.body.insertAdjacentHTML("afterbegin", text);
}

imc.onclick = () => {
  if (confirm("Overwrite current Maquette Codes?")) {
    setTimeout(() => {
      navigator.clipboard
        .readText()
        .then((text) => {
          textToMaquettes(text);
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

function update_watermark() {
  if (watermark.checked) {
    let pagesize = {};
    if (porientation.value == "landscape") {
      pagesize.width = 29.7;
      pagesize.height = 21;
      pagesize.centerx = 14.5;
      pagesize.centery = 10.5;
      pagesize.rotation = -35;
    } else {
      pagesize.width = 21;
      pagesize.height = 29.7;
      pagesize.centerx = 10.5;
      pagesize.centery = 14.5;
      pagesize.rotation = -55;
    }
    r.style.setProperty(
      "--biurl",
      `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='${pagesize.height}' width='${pagesize.width}'><text x='50%' y='50%' fill='%2355555560' font-size='${watermark_text_fontsize.value}' text-anchor='middle' dominant-baseline='central' transform='rotate(${pagesize.rotation}, ${pagesize.centerx}, ${pagesize.centery})' font-family='sans-serif'>${watermark_text.value}</text></svg>")`
    );
  }
  // else {
  //   r.style.removeProperty("--biurl");
  // }
  return watermark.checked;
}

mprint.onclick = () => {
  if (pages[0].querySelectorAll(".maquette:not([default])").length >= 1) {
    update_watermark();
    window.print();
  } else alert("No maquettes available to print");
};

draw_empty_maquettes.onclick = () => {
  let r_new = window.getComputedStyle(document.documentElement);
  let v = parseInt(r_new.getPropertyValue("--grid-v"));
  let h = parseInt(r_new.getPropertyValue("--grid-h"));
  generateGridItems(v * h * pages.length, v * h, true);
};

insert_blank_page.onclick = () => {
  createPages(1);
};

function generateGridItems(count, gic, keep = false) {
  gic = gic ?? getGridItemCount()[0];
  pages = document.querySelectorAll("page");
  let newpages = Math.ceil(count / gic) - pages.length;
  if (newpages >= 0) {
    createPages(newpages);
    pages.forEach((page) => {
      let mc = page.querySelector(".maquettecontainer");
      let l = 0;
      if (keep)
        l = page.querySelectorAll(".maquette").length; //keep old maquettes
      else mc.replaceChildren(); //remove old maquettes first

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

//set all other events
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
  m.querySelector(".content").ondblclick = () => {
    event.preventDefault();
    const t = event.target;
    if (t.classList.contains("content")) {
      let type = t.getAttribute("type");
      let other_type = type == "B" ? "S" : "B";
      let toggle = confirm(
        `Switch '${type}' type maquette for '${other_type}' type?`
      );
      if (toggle) {
        t.setAttribute("type", other_type);
      }
    }
  };
  m.querySelectorAll(".c").forEach((item) => {
    item.oncontextmenu = () => {
      event.preventDefault();
      const t = event.target;
      if (t.classList.contains("c")) {
        const currClass = t.classList[2];
        if (currClass) t.classList.remove(currClass);
        else t.classList.add("vp");
        switch (currClass) {
          case "vp":
            t.classList.add("zw");
            break;
          case "zw":
            t.classList.add("no");
            break;
          case "no":
            t.classList.add("fp");
            break;
          case "fp":
            t.classList.add("inrit-s");
            break;
          case "inrit-s":
            t.classList.add("inrit-b");
            break;
        }
      }
    };
    // item.onmousedown = () => {
    //   if (event.button === 1) {
    //     event.preventDefault();
    //     const t = event.target;
    //     if (t.classList.contains("c")) {
    //       t.classList.remove("no");
    //       t.classList.toggle("zw");
    //     }
    //   }
    // };
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
      if (t.hasChildNodes()) {
        if (
          event.shiftKey &&
          t.classList.contains("v") &&
          t.classList.contains("b")
        )
          t.classList.toggle("fb");
        else t.replaceChildren();
      } else {
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
          const p = t.parentElement;
          if (p.classList.contains("fp") || p.classList.contains("no"))
            t.classList.add("r"); //if parent has fietspad or no, cannot go left
          else t.classList.add("l");
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
          let a_txt_item = t.querySelector("a");
          let txt = prompt(
            "Enter a name for the selected vehicle",
            a_txt_item.innerText
          );
          if (txt != null && txt != "") {
            if (txt.length <= 2) {
              if (t.classList.contains("f") || t.classList.contains("fb"))
                a_txt_item.innerText = "F" + txt;
              else a_txt_item.innerText = txt;
            } else alert("Name cannot be longer than 2 characters");
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
        if (event.shiftKey) t.removeAttribute("text_top");
        else {
          let txt = prompt(
            "Enter a text for the top of the page",
            t.getAttribute("text_top") ?? ""
          );
          if (txt != null && txt != "") t.setAttribute("text_top", txt);
        }
      } else if (event.offsetY >= h) {
        if (event.shiftKey) t.removeAttribute("text_middle");
        else {
          let txt = prompt(
            "Enter a text for the middle of the page",
            t.getAttribute("text_middle") ?? ""
          );
          if (txt != null && txt != "") t.setAttribute("text_middle", txt);
        }
      }
      // console.log(event);
    }
  };
  //});
}

setPageEvents(pages[0]);

//light / dark mode toggle
document.querySelector("input[type=radio][name=theme][value=dark]").checked =
  window.matchMedia("(prefers-color-scheme:dark)").matches;
document.querySelectorAll("input[type=radio][name=theme]").forEach((item) => {
  item.onchange = () => {
    let t = event.target;
    if (t.checked) {
      switch (t.value) {
        case "light":
          r.style.setProperty("--color0", "#555");
          r.style.setProperty("--color1", "#000");
          r.style.setProperty("--color2", "#fff");
          r.style.setProperty("--color3", "#7a7a7a");
          r.style.setProperty("--color4", "#ccc");
          r.style.setProperty("--bcol1", "rgb(204, 204, 204)");
          r.style.setProperty("--bcol2", "rgb(200, 200, 200)");
          r.style.setProperty("--invert", "0");
          break;
        case "dark":
          r.style.setProperty("--color0", "#999");
          r.style.setProperty("--color1", "#fff");
          r.style.setProperty("--color2", "#2a2a2a");
          r.style.setProperty("--color3", "#666");
          r.style.setProperty("--color4", "#555");
          r.style.setProperty("--bcol1", "#444");
          r.style.setProperty("--bcol2", "rgb(70, 70, 70)");
          r.style.setProperty("--invert", "1");
          break;
      }
    }
  };
});

async function importFromFile(type = "txt") {
  let description = "Text files";
  let accept = { "text/plain": [".txt"] };
  if (type == "json") {
    description = "JSON files";
    accept = { "json/plain": [".json"] };
  } else if (type == "html") {
    description = "HTML files";
    accept = { "html/plain": [".html"] };
  }

  let [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description,
        accept,
      },
    ],
  });
  const file = await fileHandle.getFile();
  const contents = await file.text();
  if (confirm("Overwrite current Maquette Codes?")) {
    setTimeout(() => {
      try {
        if (type == "txt") textToMaquettes(contents);
        else if (type == "json") jsonToMaquettes(contents);
        else if (type == "html") htmlToMaquettes(contents);
      } catch (err) {
        alert(
          "Failed to read Maquette Codes from the selected file, please check the file and try again."
        );
        console.error(err);
      }
    }, 1000);
  }
}

imct.addEventListener("click", async () => {
  await importFromFile();
});

imcj.addEventListener("click", async () => {
  await importFromFile("json");
});

imch.addEventListener("click", async () => {
  await importFromFile("html");
});

// prevent reload or navigating away if non default maquettes exist
window.addEventListener("beforeunload", (event) => {
  if (pages[0].querySelectorAll(".maquette:not([default])").length >= 1) {
    event.preventDefault();
    event.returnValue = "";
  }
});

show_watermark.onchange = ()=>{
  let t = event.target;
  if(t.checked){
    if(update_watermark()) r.style.setProperty("--default-biurl", "var(--biurl)");
  }
  else{
    r.style.setProperty("--default-biurl", "none");
  }
}
