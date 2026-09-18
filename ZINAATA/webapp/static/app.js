const STATUS_LABEL = {
  android_only: "Android-only",
  spec_only: "Spec-sheet only",
};

// ---- Local "admin" auth (browser prototype only) ----
// Mirrors the native app's AdminStore: SHA-256(salt + pin) via Web Crypto,
// never the plain PIN, persisted in localStorage since this has no real
// backend of its own. Session (isLoggedIn) resets on reload on purpose --
// registration persists, login doesn't, same as native.
const AdminAuth = {
  isRegistered: () => !!localStorage.getItem("admin_pin_hash"),
  isDevMode: () => localStorage.getItem("dev_mode_enabled") === "true",
  setDevMode: (v) => localStorage.setItem("dev_mode_enabled", v ? "true" : "false"),
  lastResult: () => localStorage.getItem("last_result_json"),
  lastResultAt: () => localStorage.getItem("last_result_at"),
  saveLastResult: (json, at) => {
    localStorage.setItem("last_result_json", json);
    localStorage.setItem("last_result_at", at);
  },
  getName: () => localStorage.getItem("admin_name") || "",
  getLocation: () => localStorage.getItem("admin_location") || "",
  async register(name, phone, location, pin) {
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem("admin_name", name.trim());
    localStorage.setItem("admin_phone", phone.trim());
    localStorage.setItem("admin_location", location.trim());
    localStorage.setItem("admin_salt", salt);
    localStorage.setItem("admin_pin_hash", await hashPin(pin, salt));
  },
  async verify(phone, pin) {
    const storedPhone = localStorage.getItem("admin_phone");
    const salt = localStorage.getItem("admin_salt");
    const storedHash = localStorage.getItem("admin_pin_hash");
    if (!storedPhone || !salt || !storedHash) return false;
    return storedPhone === phone.trim() && (await hashPin(pin, salt)) === storedHash;
  },
};

// ---- Device owner (whose phone this is, not who's servicing it) ----
// Separate identity from AdminAuth on purpose: the engineer logging in and
// the person who owns the phone being diagnosed are two different people.
// This is what lets a submitted scan/repair-feedback be labeled with which
// phone it came from once multiple devices are in play.
const DeviceOwner = {
  getName: () => localStorage.getItem("owner_name") || "",
  getPhone: () => localStorage.getItem("owner_phone") || "",
  getLocation: () => localStorage.getItem("owner_location") || "",
  save(name, phone, location) {
    localStorage.setItem("owner_name", name.trim());
    localStorage.setItem("owner_phone", phone.trim());
    localStorage.setItem("owner_location", location.trim());
  },
  isSet: () => !!localStorage.getItem("owner_name"),
};

// Permanent seeded test account for local dev -- survives localStorage
// clears, browser resets, and app rebuilds, because it re-registers itself
// on load whenever nothing's registered. Same credentials every time on
// purpose: 9999999999 / 1234. Never a substitute for real registration on
// a real device; only runs because this is the browser prototype.
async function seedTestAccount() {
  if (!AdminAuth.isRegistered()) {
    await AdminAuth.register("Test Account", "9999999999", "Mumbai, Maharashtra, India", "1234");
  }
}

async function hashPin(pin, saltHex) {
  const bytes = new TextEncoder().encode(saltHex + pin);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readCPU() {
  const cores = navigator.hardwareConcurrency;
  if (!cores) return null;
  return `${cores} logical cores · ${navigator.platform || "?"}`;
}

async function readRAM() {
  if (!navigator.deviceMemory) return null;
  return `~${navigator.deviceMemory} GB (approximate)`;
}

async function readStorage() {
  if (!navigator.storage || !navigator.storage.estimate) return null;
  try {
    const est = await navigator.storage.estimate();
    const used = (est.usage / 1e9).toFixed(2);
    const quota = (est.quota / 1e9).toFixed(2);
    return `${used} GB used / ${quota} GB quota`;
  } catch (e) {
    return null;
  }
}

async function readGPU() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    return renderer || null;
  } catch (e) {
    return null;
  }
}

async function readBattery() {
  if (!navigator.getBattery) return null;
  try {
    const b = await navigator.getBattery();
    return `${Math.round(b.level * 100)}% · ${b.charging ? "charging" : "discharging"}`;
  } catch (e) {
    return null;
  }
}

async function readDisplay() {
  return `${screen.width}×${screen.height} @ ${window.devicePixelRatio}x · ${screen.colorDepth}-bit`;
}

async function readTouch() {
  const pts = navigator.maxTouchPoints;
  if (pts === undefined) return null;
  return `${pts} touch point${pts === 1 ? "" : "s"} supported`;
}

function readMotion(kind) {
  return new Promise((resolve) => {
    if (!window.DeviceMotionEvent) return resolve(null);
    let done = false;
    const handler = (e) => {
      if (done) return;
      let val = null;
      if (kind === "accel") {
        const a = e.accelerationIncludingGravity || e.acceleration;
        if (a && (a.x !== null || a.y !== null || a.z !== null)) {
          val = `x:${a.x?.toFixed(2)} y:${a.y?.toFixed(2)} z:${a.z?.toFixed(2)} m/s²`;
        }
      } else {
        const r = e.rotationRate;
        if (r && r.alpha !== null) {
          val = `α:${r.alpha?.toFixed(1)} β:${r.beta?.toFixed(1)} γ:${r.gamma?.toFixed(1)} °/s`;
        }
      }
      if (val) {
        done = true;
        window.removeEventListener("devicemotion", handler);
        resolve(val);
      }
    };
    window.addEventListener("devicemotion", handler);
    setTimeout(() => {
      if (!done) {
        window.removeEventListener("devicemotion", handler);
        resolve(null);
      }
    }, 1200);
  });
}

async function readAudioCount(kind) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return null;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const n = devices.filter((d) => d.kind === kind).length;
    return n > 0 ? `${n} device${n === 1 ? "" : "s"} detected` : null;
  } catch (e) {
    return null;
  }
}

async function readNetwork() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return null;
  const parts = [];
  if (c.effectiveType) parts.push(c.effectiveType);
  if (c.downlink !== undefined) parts.push(`${c.downlink} Mbps down`);
  if (c.rtt !== undefined) parts.push(`${c.rtt} ms rtt`);
  return parts.length ? parts.join(" · ") : null;
}

const READERS = {
  cpu: readCPU,
  ram: readRAM,
  storage: readStorage,
  gpu: readGPU,
  battery: readBattery,
  display: readDisplay,
  touch: readTouch,
  accel: () => readMotion("accel"),
  gyro: () => readMotion("gyro"),
  mic_count: () => readAudioCount("audioinput"),
  speaker_count: () => readAudioCount("audiooutput"),
  network: readNetwork,
};

async function resolveValue(item) {
  if (item.status !== "live_candidate" || !item.browser_key) {
    return { text: STATUS_LABEL[item.status] || "—", dotClass: item.status === "android_only" ? "dot-android" : "dot-spec" };
  }
  const reader = READERS[item.browser_key];
  const value = reader ? await reader() : null;
  if (value) return { text: value, dotClass: "dot-live" };
  return { text: "no data in this browser tab", dotClass: "dot-android" };
}

function cardTemplate(category) {
  const rows = category.items
    .map(
      (item) => `
      <div class="row" data-id="${item.id}">
        <span class="dot dot-spec"></span>
        <span class="label">${item.label}</span>
        <span class="value">…</span>
      </div>`
    )
    .join("");
  return `<section class="card" data-category="${category.category}"><h2>${category.category}</h2>${rows}</section>`;
}

// Hand-packed order (measured against actual rendered chip widths at
// 390px frame width) so rows 1-3 fill edge to edge with near-zero gap.
// "Motion & Environmental Sensors" is the one label wide enough (229px of
// a 338px row) that nothing packs tightly next to it, so it's pinned last,
// alone, on purpose -- that's the deliberately half-open row reserved for
// future chips, not leftover waste like the earlier default ordering had.
const DOCK_ORDER = [
  "All",
  "Passive & Discrete",
  "Audio & Haptics",
  "Display & Input",
  "Compute",
  "Thermal",
  "Chassis",
  "Camera",
  "Radios",
  "Power",
  "Motion & Env Sensors",
];

// Not category filters -- app-level actions, tucked into the reserved space
// on the last dock row. Styled differently (.chip-alt) so they read as a
// different kind of control, not one more scan category.
const DOCK_ACTIONS = [{ key: "__admin__", label: "Admin" }];

function renderChips(catalog) {
  const chipRow = document.getElementById("chip-row");
  const devMode = AdminAuth.isDevMode();

  const allChip = { key: "All", label: "All" };
  let catChips = [];
  if (devMode) {
    const catalogNames = catalog.map((c) => c.category);
    const known = DOCK_ORDER.filter((n) => n === "All" || catalogNames.includes(n));
    const extra = catalogNames.filter((n) => !DOCK_ORDER.includes(n));
    catChips = [...known, ...extra].filter((n) => n !== "All").map((name) => ({ key: name, label: name }));
  }
  const allChips = [allChip, ...catChips, ...DOCK_ACTIONS];

  chipRow.innerHTML = allChips
    .map(
      (c, i) =>
        `<button class="chip${i === 0 ? " active" : ""}${c.key.startsWith("__") ? " chip-alt" : ""}"${
          c.ariaLabel ? ` aria-label="${c.ariaLabel}"` : ""
        } data-filter="${c.key}">${c.label}</button>`
    )
    .join("");
}

function showMainPanel(panel) {
  document.getElementById("cards").hidden = panel !== "cards";
  document.getElementById("healthSummary").hidden = panel !== "healthSummary";
  document.getElementById("adminSection").hidden = panel !== "adminSection";
  document.getElementById("legend").hidden = panel !== "cards" || !AdminAuth.isDevMode();
}

function setupDockFilter() {
  const chipRow = document.getElementById("chip-row");
  chipRow.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    chipRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;

    if (filter === "__admin__") {
      if (!adminLoggedIn) adminViewOverride = null;
      showMainPanel("adminSection");
      renderAdminSection();
      return;
    }

    if (!AdminAuth.isDevMode()) {
      showMainPanel("healthSummary");
      renderHealthSummary();
      return;
    }

    showMainPanel("cards");
    document.querySelectorAll("#cards .card").forEach((card) => {
      card.style.display = filter === "All" || card.dataset.category === filter ? "" : "none";
    });
  });
}

// Session-only, like native: registration persists (AdminAuth/localStorage),
// being logged in doesn't -- reset to false on every page load.
let adminLoggedIn = false;
// Lets the "Log in instead" / "Register instead" links show either form on
// request, regardless of stored state -- resets to null (natural default)
// every time Admin is opened fresh from the dock.
let adminViewOverride = null;

const PHONE_RE = /^\d{10}$/;
const PIN_RE = /^\d{4,6}$/;

function renderAdminSection() {
  const registered = AdminAuth.isRegistered();
  const showRegister = adminViewOverride ? adminViewOverride === "register" : !registered;
  document.getElementById("adminRegister").hidden = adminLoggedIn || !showRegister;
  document.getElementById("adminLogin").hidden = adminLoggedIn || showRegister;
  document.getElementById("adminDashboard").hidden = !adminLoggedIn;
  if (adminLoggedIn) {
    document.getElementById("backendUrlInput").value = localStorage.getItem("backend_url") || "";
    document.getElementById("devModeToggle").checked = AdminAuth.isDevMode();
    document.getElementById("downloadStatus").textContent = "";
    document.getElementById("dashWhoami").textContent = `${AdminAuth.getName()} · ${AdminAuth.getLocation()}`;
    document.getElementById("ownerName").value = DeviceOwner.getName();
    document.getElementById("ownerPhone").value = DeviceOwner.getPhone();
    document.getElementById("ownerLocation").value = DeviceOwner.getLocation();
  }
}

function setupLocationAutocomplete(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  let debounceTimer = null;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 3) {
      results.hidden = true;
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const places = await res.json();
        if (!Array.isArray(places) || places.length === 0) {
          results.innerHTML = `<div class="location-result-item">no matches</div>`;
          results.hidden = false;
          return;
        }
        results.innerHTML = places
          .map((p) => `<div class="location-result-item" data-value="${p.display_name.replace(/"/g, "&quot;")}">${p.display_name}</div>`)
          .join("");
        results.hidden = false;
      } catch (e) {
        results.hidden = true;
      }
    }, 400);
  });

  results.addEventListener("click", (e) => {
    const item = e.target.closest(".location-result-item");
    if (!item || !item.dataset.value) return;
    input.value = item.dataset.value;
    results.hidden = true;
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input && !results.contains(e.target)) results.hidden = true;
  });
}

function setupAdmin() {
  document.querySelectorAll("[data-goto-all]").forEach((el) => {
    el.addEventListener("click", () => document.querySelector('[data-filter="All"]').click());
  });
  document.querySelectorAll("[data-show-login]").forEach((el) => {
    el.addEventListener("click", () => { adminViewOverride = "login"; renderAdminSection(); });
  });
  document.querySelectorAll("[data-show-register]").forEach((el) => {
    el.addEventListener("click", () => { adminViewOverride = "register"; renderAdminSection(); });
  });
  document.querySelectorAll("[data-toggle-eye]").forEach((eye) => {
    eye.addEventListener("click", () => {
      const input = document.getElementById(eye.dataset.toggleEye);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      eye.textContent = showing ? "show" : "hide";
    });
  });

  document.getElementById("regSubmit").addEventListener("click", async () => {
    const name = document.getElementById("regName").value;
    const phone = document.getElementById("regPhone").value.trim();
    const location = document.getElementById("regLocation").value;
    const pin = document.getElementById("regPin").value;
    const confirmPin = document.getElementById("regPinConfirm").value;
    const errorEl = document.getElementById("regError");
    if (!name.trim()) return (errorEl.textContent = "please enter your name");
    if (!PHONE_RE.test(phone)) return (errorEl.textContent = "please enter a 10-digit phone number");
    if (!location.trim()) return (errorEl.textContent = "please choose a location");
    if (!PIN_RE.test(pin)) return (errorEl.textContent = "please enter a 4-6 digit PIN");
    if (pin !== confirmPin) return (errorEl.textContent = "PINs don't match");
    errorEl.textContent = "";
    await AdminAuth.register(name, phone, location, pin);
    adminLoggedIn = true;
    adminViewOverride = null;
    renderAdminSection();
  });

  document.getElementById("loginSubmit").addEventListener("click", async () => {
    const phone = document.getElementById("loginPhone").value.trim();
    const pin = document.getElementById("loginPin").value;
    const errorEl = document.getElementById("loginError");
    if (!PHONE_RE.test(phone)) return (errorEl.textContent = "please enter a 10-digit phone number");
    if (!PIN_RE.test(pin)) return (errorEl.textContent = "please enter a 4-6 digit PIN");
    if (await AdminAuth.verify(phone, pin)) {
      errorEl.textContent = "";
      adminLoggedIn = true;
      adminViewOverride = null;
      renderAdminSection();
    } else {
      errorEl.textContent = "wrong phone number or PIN";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    adminLoggedIn = false;
    adminViewOverride = null;
    renderAdminSection();
  });

  setupLocationAutocomplete("regLocation", "regLocationResults");
  setupLocationAutocomplete("ownerLocation", "ownerLocationResults");

  document.getElementById("saveOwnerBtn").addEventListener("click", () => {
    DeviceOwner.save(
      document.getElementById("ownerName").value,
      document.getElementById("ownerPhone").value,
      document.getElementById("ownerLocation").value
    );
    const btn = document.getElementById("saveOwnerBtn");
    btn.textContent = "Saved";
    setTimeout(() => { btn.textContent = "Save Owner Info"; }, 1500);
  });

  document.getElementById("saveUrlBtn").addEventListener("click", () => {
    const url = document.getElementById("backendUrlInput").value.trim();
    localStorage.setItem("backend_url", url);
    const btn = document.getElementById("saveUrlBtn");
    btn.textContent = "Saved";
    setTimeout(() => { btn.textContent = "Save URL"; }, 1500);
  });

  document.getElementById("devModeToggle").addEventListener("change", (e) => {
    AdminAuth.setDevMode(e.target.checked);
    if (currentCatalog) renderChips(currentCatalog);
  });

  document.getElementById("downloadDatasetBtn").addEventListener("click", async () => {
    const statusEl = document.getElementById("downloadStatus");
    const backendUrl = localStorage.getItem("backend_url") || "";
    if (!backendUrl) {
      statusEl.textContent = "backend URL not configured yet";
      return;
    }
    statusEl.textContent = "downloading…";
    try {
      const res = await fetch(`${backendUrl}/api/results?device_id=browser-preview&limit=1`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data) || data.length === 0) {
        statusEl.textContent = (data && data.error) || "no results available yet";
        return;
      }
      const now = new Date().toLocaleString();
      AdminAuth.saveLastResult(JSON.stringify(data[0]), now);
      statusEl.textContent = "downloaded ✓";
    } catch (e) {
      statusEl.textContent = `network error: ${e.message}`;
    }
  });

  const modal = document.getElementById("repairFeedbackModal");
  document.getElementById("repairFeedbackOpen").addEventListener("click", () => {
    modal.hidden = false;
  });
  document.getElementById("rfModalClose").addEventListener("click", () => {
    modal.hidden = true;
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) modal.hidden = true;
  });
}

function friendlyDeviceLabel() {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Linux/.test(ua)) os = "Linux";
  let browser = "browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  return `${os} · ${browser} (prototype preview, not the native app)`;
}

function renderHealthSummary() {
  const device = friendlyDeviceLabel();
  document.getElementById("hsDeviceModel").textContent = DeviceOwner.isSet()
    ? `${DeviceOwner.getName()} — ${device}`
    : device;
  const body = document.getElementById("hsBody");
  const json = AdminAuth.lastResult();
  if (!json) {
    body.innerHTML = `
      <div class="hs-empty-title">Health summary not available yet</div>
      <p class="hs-empty-body">This phone has been scanned, but a diagnostic analysis hasn't been downloaded yet. An admin needs to run the analysis and download the results.</p>`;
    return;
  }
  let fields = {};
  try {
    const obj = JSON.parse(json);
    fields = obj.output || obj;
  } catch (e) {
    body.innerHTML = `<p class="hs-empty-body">Couldn't read the last downloaded result.</p>`;
    return;
  }
  const rows = Object.entries(fields)
    .map(([k, v]) => `<div class="hs-field"><span class="hs-key">${k}: </span><span class="hs-val">${v}</span></div>`)
    .join("");
  body.innerHTML = `
    <div class="hs-result-title">Latest analysis</div>
    <div class="hs-result-at">as of ${AdminAuth.lastResultAt() || "unknown time"}</div>
    ${rows}`;
}

function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  el.textContent = `${h}:${m} ${ampm}`;
}

let currentCatalog = null;

async function runScan() {
  const scanbar = document.getElementById("scanbar");
  const cards = document.getElementById("cards");

  scanbar.style.width = "0%";
  void scanbar.offsetWidth;
  scanbar.style.width = "70%";

  const res = await fetch("/api/components");
  const catalog = await res.json();
  currentCatalog = catalog;

  renderChips(catalog);
  showMainPanel(AdminAuth.isDevMode() ? "cards" : "healthSummary");
  if (!AdminAuth.isDevMode()) renderHealthSummary();
  cards.innerHTML = catalog.map((c) => cardTemplate(c)).join("");
  Array.from(cards.querySelectorAll(".card")).forEach((card, i) => {
    card.style.animationDelay = `${i * 40}ms`;
  });

  const allItems = catalog.flatMap((c) => c.items);
  await Promise.all(
    allItems.map(async (item) => {
      const { text, dotClass } = await resolveValue(item);
      const row = cards.querySelector(`.row[data-id="${item.id}"]`);
      if (!row) return;
      row.querySelector(".value").textContent = text;
      const dot = row.querySelector(".dot");
      dot.className = `dot ${dotClass}`;
    })
  );

  scanbar.style.width = "100%";
  setTimeout(() => {
    scanbar.style.transition = "none";
    scanbar.style.width = "0%";
    requestAnimationFrame(() => {
      scanbar.style.transition = "width 0.9s cubic-bezier(0.4,0,0.2,1)";
    });
  }, 500);
}

function setupRepairFeedback() {
  const filesInput = document.getElementById("rfFiles");
  const fileList = document.getElementById("rfFileList");
  let attachedFiles = [];

  filesInput.addEventListener("change", () => {
    attachedFiles = attachedFiles.concat(Array.from(filesInput.files));
    renderFileList();
    filesInput.value = "";
  });

  function renderFileList() {
    fileList.innerHTML = "";
    attachedFiles.forEach((file, i) => {
      const item = document.createElement("div");
      item.className = "rf-file-item";
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        item.appendChild(img);
      }
      const name = document.createElement("span");
      name.className = "rf-file-name";
      name.textContent = `${file.name} (${(file.size / 1024).toFixed(0)}KB)`;
      item.appendChild(name);
      const remove = document.createElement("span");
      remove.className = "rf-file-remove";
      remove.textContent = "✕";
      remove.addEventListener("click", () => {
        attachedFiles.splice(i, 1);
        renderFileList();
      });
      item.appendChild(remove);
      fileList.appendChild(item);
    });
  }

  function setupRecorder({ btn, timerEl, constraints, mimeHint, onStart, onStop }) {
    let recorder = null;
    let chunks = [];
    let stream = null;
    let startTime = 0;
    let timerInterval = null;
    let resultBlob = null;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        timerEl.textContent = "permission denied";
        return;
      }
      if (onStart) onStart(stream);
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        resultBlob = new Blob(chunks, { type: mimeHint });
        stream.getTracks().forEach((t) => t.stop());
        onStop(resultBlob);
      };
      recorder.start();
      btn.classList.add("recording");
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const secs = Math.floor((Date.now() - startTime) / 1000);
        timerEl.textContent = `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
      }, 200);
    }

    function stop() {
      if (recorder && recorder.state !== "inactive") recorder.stop();
      btn.classList.remove("recording");
      clearInterval(timerInterval);
      timerEl.textContent = "Hold to record";
    }

    btn.addEventListener("mousedown", start);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); start(); });
    btn.addEventListener("mouseup", stop);
    btn.addEventListener("mouseleave", stop);
    btn.addEventListener("touchend", stop);

    return {
      getBlob: () => resultBlob,
      // exposed for programmatic testing, since a real press-and-hold
      // gesture can't be scripted the same way a click can
      _start: start,
      _stop: stop,
    };
  }

  const audioPlayback = document.getElementById("rfAudioPlayback");
  const audioRecorder = setupRecorder({
    btn: document.getElementById("rfAudioBtn"),
    timerEl: document.getElementById("rfAudioTimer"),
    constraints: { audio: true },
    mimeHint: "audio/webm",
    onStop: (blob) => {
      audioPlayback.src = URL.createObjectURL(blob);
      audioPlayback.hidden = false;
    },
  });

  const videoLive = document.getElementById("rfVideoLive");
  const videoPlayback = document.getElementById("rfVideoPlayback");
  const videoRecorder = setupRecorder({
    btn: document.getElementById("rfVideoBtn"),
    timerEl: document.getElementById("rfVideoTimer"),
    constraints: { audio: true, video: true },
    mimeHint: "video/webm",
    onStart: (stream) => {
      videoPlayback.hidden = true;
      videoLive.srcObject = stream;
      videoLive.hidden = false;
    },
    onStop: (blob) => {
      videoLive.hidden = true;
      videoLive.srcObject = null;
      videoPlayback.src = URL.createObjectURL(blob);
      videoPlayback.hidden = false;
    },
  });

  const submitBtn = document.getElementById("rfSubmit");
  const statusEl = document.getElementById("rfStatus");

  submitBtn.addEventListener("click", async () => {
    const notes = document.getElementById("rfNotes").value;
    const audioBlob = audioRecorder.getBlob();
    const videoBlob = videoRecorder.getBlob();
    if (!notes.trim() && attachedFiles.length === 0 && !audioBlob && !videoBlob) {
      statusEl.textContent = "Nothing to submit yet.";
      return;
    }
    submitBtn.disabled = true;
    statusEl.textContent = "Uploading…";

    const formData = new FormData();
    formData.append("notes", notes);
    formData.append("owner_name", DeviceOwner.getName());
    formData.append("owner_phone", DeviceOwner.getPhone());
    formData.append("owner_location", DeviceOwner.getLocation());
    formData.append("engineer_name", AdminAuth.getName());
    attachedFiles.forEach((f) => formData.append("files", f, f.name));
    if (audioBlob) formData.append("audio", audioBlob, "voice-note.webm");
    if (videoBlob) formData.append("video", videoBlob, "video.webm");

    try {
      const res = await fetch("/api/repair-feedback", { method: "POST", body: formData });
      const data = await res.json();
      statusEl.textContent = res.ok ? `Submitted — ${data.summary}` : `Failed: ${data.error || res.status}`;
    } catch (e) {
      statusEl.textContent = `Network error: ${e.message}`;
    }
    submitBtn.disabled = false;
  });

  window.__rfDebug = { audioRecorder, videoRecorder };
}

document.getElementById("rescan").addEventListener("click", runScan);
setupDockFilter();
setupAdmin();
setupRepairFeedback();
seedTestAccount();
updateClock();
setInterval(updateClock, 30000);
runScan();
