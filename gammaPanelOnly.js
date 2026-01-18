// === gammaPanelOnly.js ===
// Settings panel that stores commune rules & key mappings in localStorage.

(function () {
  const STORAGE_KEY = "gammaConfig";
  const config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    claimKey: "c",
    communeKey: "shift",
    cityCycleKey: "control",
    communes: [],
    position: { top: 100, left: null, right: 40 },
    size: { width: 320, height: 400 }
  };
  const saveConfig = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  // ---------- Main Panel ----------
  const panel = document.createElement("div");
  panel.innerHTML = `
    <div id="gammaHeader">⚙️ Gamma Settings</div>
    <div class="gammaSection">
      <h4>🗺️ Commune Mapping</h4>
      <div id="communeList"></div>
      <div class="gammaRow">
        <input id="fromCommune" placeholder="Selected">
        <input id="toCommune" placeholder="Written">
        <button id="addCommune">Add</button>
      </div>
    </div>
    <div class="gammaSection">
      <h4>⌨️ Shortcut Keys</h4>
      <label>C key <input id="claimKey" value="${config.claimKey}"></label><br>
      <label>Shift key <input id="communeKey" value="${config.communeKey}"></label><br>
      <label>Ctrl key <input id="cityKey" value="${config.cityCycleKey}"></label>
    </div>
    <div class="gammaFooter">
      <button id="saveGamma">💾 Save</button>
      <button id="closeGamma">✖ Close</button>
    </div>
    <div id="gammaResizer"></div>
  `;
  Object.assign(panel.style, {
    position: "fixed",
    top: config.position.top + "px",
    right: config.position.right !== null ? config.position.right + "px" : "auto",
    left: config.position.left !== null ? config.position.left + "px" : "auto",
    width: config.size.width + "px",
    height: config.size.height + "px",
    background: "#1f1f2e",
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
    fontFamily: "Segoe UI, sans-serif",
    zIndex: 999998,
    display: "none",
    opacity: "0",
    transition: "opacity 0.3s",
    overflow: "hidden"
  });
  document.body.appendChild(panel);

  // ---------- Styles ----------
  const style = document.createElement("style");
  style.textContent = `
    #gammaHeader {
      background: #4b8bf4;
      padding: 8px;
      font-weight: bold;
      border-radius: 12px 12px 0 0;
      cursor: move;
      text-align: center;
    }
    .gammaSection {
      padding: 8px 10px;
      background: #2b2b3f;
      margin: 6px;
      border-radius: 8px;
      overflow-y: auto;
      max-height: 150px;
    }
    .gammaRow { display: flex; gap: 4px; align-items: center; }
    input {
      padding: 5px;
      border: none;
      border-radius: 6px;
      outline: none;
      width: 110px;
    }
    button {
      background: #4b8bf4;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 5px 8px;
      cursor: pointer;
    }
    button:hover { background: #356de0; }
    #communeList { max-height: 100px; overflow-y: auto; margin-bottom: 6px; font-size: 13px; }
    .gammaFooter { text-align: center; border-top: 1px solid #555; padding: 6px; }
    #gammaResizer {
      width: 14px; height: 14px;
      position: absolute; bottom: 4px; right: 4px;
      cursor: se-resize;
    }
    #gammaResizer::after {
      content: ''; border-right: 2px solid #777; border-bottom: 2px solid #777;
      width: 10px; height: 10px; position: absolute; bottom: 0; right: 0;
    }
  `;
  document.head.appendChild(style);

  // ---------- Commune List ----------
  const listEl = panel.querySelector("#communeList");
  function renderList() {
    listEl.innerHTML = config.communes
      .map(
        (c, i) =>
          `<div>${i + 1}. ${c.from} → <b>${c.to}</b> <button data-i="${i}" style="background:#e05c4b;">x</button></div>`
      )
      .join("");
  }
  renderList();

  // ---------- Add rule ----------
  panel.querySelector("#addCommune").onclick = () => {
    const from = panel.querySelector("#fromCommune").value.trim();
    const to = panel.querySelector("#toCommune").value.trim();
    if (!from || !to) return alert("Please fill both fields!");
    config.communes.push({ from, to });
    localStorage.setItem("gammaRules", JSON.stringify(config.communes));
    renderList();
    panel.querySelector("#fromCommune").value = "";
    panel.querySelector("#toCommune").value = "";
  };

  listEl.onclick = (e) => {
    if (e.target.dataset.i) {
      config.communes.splice(e.target.dataset.i, 1);
      localStorage.setItem("gammaRules", JSON.stringify(config.communes));
      renderList();
    }
  };

  // ---------- Save keys ----------
  panel.querySelector("#saveGamma").onclick = () => {
    config.claimKey = panel.querySelector("#claimKey").value.toLowerCase();
    config.communeKey = panel.querySelector("#communeKey").value.toLowerCase();
    config.cityCycleKey = panel.querySelector("#cityKey").value.toLowerCase();
    saveConfig();
    localStorage.setItem("gammaKeys", JSON.stringify({
      claimKey: config.claimKey,
      communeKey: config.communeKey,
      cityCycleKey: config.cityCycleKey
    }));
    alert("✅ Saved!");
  };

  panel.querySelector("#closeGamma").onclick = () => hidePanel();

  // ---------- Show / Hide ----------
  function showPanel() {
    panel.style.display = "block";
    setTimeout(() => (panel.style.opacity = "1"), 10);
  }
  function hidePanel() {
    panel.style.opacity = "0";
    setTimeout(() => (panel.style.display = "none"), 300);
  }

  // ---------- Move ----------
  (function makeDraggable(el, header) {
    let offsetX, offsetY, dragging = false;
    header.addEventListener("mousedown", (e) => {
      dragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop);
    });
    function move(e) {
      if (!dragging) return;
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e.clientY - offsetY + "px";
      el.style.right = "auto";
    }
    function stop() {
      dragging = false;
      config.position = {
        top: parseInt(el.style.top),
        left: parseInt(el.style.left) || null,
        right: null
      };
      saveConfig();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }
  })(panel, panel.querySelector("#gammaHeader"));

  // ---------- Resize ----------
  (function makeResizable(el, handle) {
    let startX, startY, startW, startH, resizing = false;
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = el.offsetWidth;
      startH = el.offsetHeight;
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stop);
    });
    function resize(e) {
      if (!resizing) return;
      const newW = startW + (e.clientX - startX);
      const newH = startH + (e.clientY - startY);
      el.style.width = newW + "px";
      el.style.height = newH + "px";
    }
    function stop() {
      resizing = false;
      config.size = {
        width: parseInt(el.style.width),
        height: parseInt(el.style.height)
      };
      saveConfig();
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stop);
    }
  })(panel, panel.querySelector("#gammaResizer"));

  // ---------- Public helpers ----------
  window.showGammaPanel = showPanel;
  window.hideGammaPanel = hidePanel;
  console.log("✅ Gamma panel ready — call showGammaPanel() to open it.");
})();
