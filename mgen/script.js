const maquette = document.createElement("div");
maquette.classList.add("maquette");
maquette.innerHTML = `
    <div class="content">
        <div class="c tl"></div>
        <div class="c tr"></div>
        <div class="c br"></div>
        <div class="c bl"></div>
        <a>S</a>
    </div>
    <input
        type="text"
        placeholder="Maquette Code"
    />
`;
let r = document.querySelector(":root");
const gsize = document.getElementById("gsize");
const pmargin = document.getElementById("pmargin");
const mborder = document.getElementById("mborder");
const mcinput = document.getElementById("mcinput");
const fsize = document.getElementById("fsize");
const awidth = document.getElementById("awidth");
const asize = document.getElementById("asize");
const cmc = document.getElementById("cmc");
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

mcinput.onchange = () => {
  if (event.target.checked) r.style.setProperty("--mcinput", "visible");
  else r.style.setProperty("--mcinput", "hidden");
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

cmc.onclick = () => {
  let strArr = [];
  document.querySelectorAll("page input").forEach((item, index) => {
    if (item.value != "") strArr[index] = item.value;
  });
  let str = strArr.join("\r\n");
  if (str != "") {
    navigator.clipboard.writeText(str);
    alert("Maquette Codes copied to clipboard");
  }
};

imc.onclick = () => {
  if (confirm("Overwrite current Maquette Codes?")) {
    navigator.clipboard
      .readText()
      .then((text) => {
        let strArr = text.split("\r\n");
        generateGridItems(strArr.length);
        let inputs = document.querySelectorAll("page input");
        if (inputs.length > 0) {
          strArr.forEach((item, index) => {
            inputs[index].value = item;
            inputs[index].dispatchEvent(
              new KeyboardEvent("keypress", {
                key: "Enter",
              })
            );
          });
          console.log("Maquette Codes imported from clipboard");
        }
      })
      .catch((err) => {
        alert("Failed to read Maquette Codes from clipboard");
        console.error(err);
      });
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

  for (let i = 1; i <= count; i++) {
    let newnewpage = newpage.cloneNode();
    document.body.insertBefore(newnewpage, settings);
    observer.observe(newnewpage);
  }
  pages = document.querySelectorAll("page");
  pagecount_total.innerText = pages.length;
  //return pages;
}

mprint.onclick = () => {
  if (pages[0].querySelectorAll(".maquette").length >= 1) window.print();
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
      page.innerHTML = "";
      for (let i = 1; i <= gic; i++) {
        let m2 = maquette.cloneNode(true);
        m2.querySelector("input[type=text]").onkeypress = () => {
          if (event.key === "Enter") {
            let maquette_content =
              event.target.parentElement.querySelector(".content");
            let value = event.target.value;
            const cs_loc = ["tl", "tr", "br", "bl"];
            let html = "";
            let cs = value.split(";");
            for (let i = 0; i < 4; i++) {
              html += `<div class="c ${cs_loc[i]}">`;
              let c = cs[i];
              if (c) {
                let vs = c.split(",");
                vs.forEach((v) => {
                  let vdata = v.split(".");
                  html += `<div class="v ${vdata[0]}" value="${
                    vdata[1] ?? ""
                  }"></div>`;
                });
              }
              html += `</div>`;
            }
            html += `<a>S</a>`;
            maquette_content.innerHTML = html;
          }
        };
        page.appendChild(m2);
      }
    });
  }
}

// l.1,r.2;l.3,d.4;d.5,d.6;r.7
