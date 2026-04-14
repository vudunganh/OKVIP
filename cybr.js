// cybr.js - Auto Fill Bookmarklet v2.0 | @vlxx_12
(function () {
  if (document.getElementById("cybrWidget")) return;

  // ── Helpers ──────────────────────────────────────────────
  window._setNativeValue = function (el, val) {
    if (!el) return;
    try { el.focus(); } catch (_) {}
    const nativeSetter =
      Object.getOwnPropertyDescriptor(el, "value")?.set ||
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")?.set;
    if (nativeSetter) {
      nativeSetter.call(el, val);
    } else {
      el.value = val;
    }
    ["keydown", "keypress", "input", "keyup", "change"].forEach(ev =>
      el.dispatchEvent(new Event(ev, { bubbles: true }))
    );
    try { el.blur(); } catch (_) {}
  };

  // ── CSS ───────────────────────────────────────────────────
  const style = document.createElement("style");
  style.innerHTML = `
    #cybrWidget{position:fixed;top:10px;right:10px;width:280px;background:rgba(10,10,16,.95);border:2px solid #0ff;border-radius:8px;box-shadow:0 0 10px #0ff,inset 0 0 10px #0ff;z-index:999999;font-family:'Courier New',monospace;padding:12px;color:#fff;transition:all .3s;backdrop-filter:blur(5px)}
    #cybrWidget *{box-sizing:border-box}
    .cybr-header{display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid #f0f;padding-bottom:8px;margin-bottom:10px}
    .cybr-title{font-size:15px;font-weight:700;color:#f0f;text-shadow:0 0 5px #f0f}
    .cybr-btn{background:transparent;border:1px solid #0ff;color:#0ff;padding:6px;cursor:pointer;transition:.2s;border-radius:4px;text-shadow:0 0 2px #0ff}
    .cybr-btn:hover{background:#0ff;color:#000;box-shadow:0 0 8px #0ff}
    .cybr-neon{width:100%;padding:8px;background:#1a1a2e;color:#0ff;border:1px solid #0ff;border-radius:4px;cursor:pointer;margin-bottom:8px;font-weight:700;text-shadow:0 0 3px #0ff;box-shadow:0 0 5px rgba(0,255,255,.3);transition:.3s}
    .cybr-neon:hover{background:#0ff;color:#000;box-shadow:0 0 12px #0ff}
    .pink{border-color:#f0f;color:#f0f;text-shadow:0 0 3px #f0f;box-shadow:0 0 5px rgba(255,0,255,.3)}
    .pink:hover{background:#f0f;color:#000;box-shadow:0 0 12px #f0f}
    #cw-ta{width:100%;height:50px;background:#000;color:#0ff;border:1px solid #f0f;margin-bottom:10px;padding:5px;resize:none;font-size:12px}
    #cw-ta:focus{outline:none;box-shadow:0 0 5px #f0f}
    .cybr-row{display:flex;gap:5px;margin-bottom:5px}
    .cybr-row button{flex:1;padding:5px;font-size:11px}
    #cw-mini{display:none;text-align:center;font-size:18px;font-weight:700;color:#0ff;text-shadow:0 0 8px #0ff,0 0 12px #f0f;cursor:pointer;padding:5px}
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────
  const root = document.createElement("div");
  root.id = "cybrWidget";
  root.innerHTML = `
    <div id="cw-mini">@vlxx_12</div>
    <div id="cw-main">
      <div class="cybr-header" id="cw-head">
        <span class="cybr-title">AUTO FILL v2.0</span>
        <div>
          <button class="cybr-btn" id="cw-min">➖</button>
          <button class="cybr-btn" style="color:#f00;border-color:#f00" id="cw-cls">❌</button>
        </div>
      </div>
      <textarea id="cw-ta" placeholder="Paste Base64..."></textarea>
      <button class="cybr-neon" id="cw-fill">1. FILL FORM AUTO</button>
      <button class="cybr-neon pink" id="cw-bank">2. THÊM BANK</button>
      <div style="font-size:11px;color:#aaa;margin-bottom:4px;text-align:center">--- MỞ GAME ---</div>
      <div class="cybr-row">
        <button class="cybr-neon" style="border-color:#f00;color:#f00;text-shadow:0 0 3px #f00" id="cw-g1">Go99</button>
        <button class="cybr-neon pink" id="cw-g2">Mmoo</button>
        <button class="cybr-neon" style="border-color:#00f;color:#4169E1;text-shadow:0 0 3px #00f" id="cw-g3">Tt88</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── Elements ──────────────────────────────────────────────
  const ta    = document.getElementById("cw-ta");
  const mini  = document.getElementById("cw-mini");
  const main  = document.getElementById("cw-main");
  const head  = document.getElementById("cw-head");
  const btnMin = document.getElementById("cw-min");
  const btnCls = document.getElementById("cw-cls");

  // ── Minimise toggle ───────────────────────────────────────
  let minimised = false;
  function toggleMin() {
    minimised = !minimised;
    if (minimised) {
      main.style.display = "none";
      mini.style.display = "block";
      root.style.cssText = "position:fixed;top:10px;right:10px;width:130px;padding:5px;background:rgba(10,10,16,.95);border:2px solid #f0f;border-radius:8px;z-index:999999;backdrop-filter:blur(5px)";
    } else {
      main.style.display = "block";
      mini.style.display = "none";
      root.style.cssText = "position:fixed;top:10px;right:10px;width:280px;padding:12px;background:rgba(10,10,16,.95);border:2px solid #0ff;border-radius:8px;z-index:999999;backdrop-filter:blur(5px)";
    }
  }
  btnMin.onclick = toggleMin;
  mini.onclick   = toggleMin;
  btnCls.onclick = () => root.remove();

  // ── Drag ──────────────────────────────────────────────────
  let dragging = false, ox = 0, oy = 0;
  head.onmousedown = ev => {
    if (ev.target === btnMin || ev.target === btnCls) return;
    dragging = true;
    const r = root.getBoundingClientRect();
    ox = ev.clientX - r.left;
    oy = ev.clientY - r.top;
  };
  document.onmousemove = ev => {
    if (!dragging) return;
    root.style.left  = (ev.clientX - ox) + "px";
    root.style.top   = (ev.clientY - oy) + "px";
    root.style.right = "auto";
  };
  document.onmouseup = () => { dragging = false; };

  // ── Game links ────────────────────────────────────────────
  document.getElementById("cw-g1").onclick = () => window.open("https://m.91111119.com/Account/Register?f=4846407", "_blank");
  document.getElementById("cw-g2").onclick = () => window.open("https://m.77000777.com/Account/Register?f=2465404", "_blank");
  document.getElementById("cw-g3").onclick = () => window.open("https://m.88807888.app/Account/Register?f=4601566", "_blank");

  // ── Helpers ───────────────────────────────────────────────
  async function getB64() {
    let v = ta.value.trim();
    if (!v) {
      try { v = (await navigator.clipboard.readText()).trim(); ta.value = v; } catch (_) {}
    }
    return v;
  }

  function parseData(str) {
    return JSON.parse(atob(str.trim()));
  }

  // ── Fill form ─────────────────────────────────────────────
  document.getElementById("cw-fill").onclick = async () => {
    const str = await getB64();
    if (!str) { alert("Clipboard trống!"); return; }
    try {
      const j = parseData(str);
      const map = {
        account:         ['[formcontrolname="account"]',         'input.ng-untouched.ng-invalid:nth-child(2)'],
        password:        ['[formcontrolname="password"]',        '.w-full > fieldset:nth-child(1) > div:nth-child(2) > div:nth-child(2) > input'],
        confirmPassword: ['[formcontrolname="confirmPassword"]', '.w-full > fieldset:nth-child(1) > div:nth-child(3) > div:nth-child(2) > input'],
        moneyPassword:   ['[formcontrolname="moneyPassword"]',   '.w-full > fieldset:nth-child(1) > div:nth-child(4) > div:nth-child(2) > input'],
        name:            ['[formcontrolname="name"]',            '.name input'],
      };
      let filled = 0;
      for (const key of Object.keys(map)) {
        if (!j[key]) continue;
        let el = null;
        for (const sel of map[key]) { el = document.querySelector(sel); if (el) break; }
        if (el) { window._setNativeValue(el, j[key]); filled++; }
      }
      if (!filled) { alert("Không tìm thấy ô nhập liệu!"); return; }
      const cb = document.querySelector('[formcontrolname="agree"]');
      if (cb && !cb.checked) cb.click();
      ta.value = `> Đã Fill (${filled}/5).\nNhập Captcha rồi bấm Đăng Ký!`;
    } catch (e) { alert("Lỗi: " + e.message); }
  };

  // ── Add Bank ──────────────────────────────────────────────
  document.getElementById("cw-bank").onclick = async () => {
    const str = await getB64();
    if (!str) { alert("Clipboard trống!"); return; }
    try {
      const j = parseData(str);
      if (!j.bankName || !j.bankAccount) { alert("Dữ liệu Bank trống!\nGửi bot: Tên | STK | BANK"); return; }

      const arrow = document.querySelector(".mat-select-arrow-wrapper");
      if (!arrow) {
        if (!location.href.includes("Financial?type=withdraw")) {
          if (confirm("Đi tới trang Rút Tiền?")) location.href = location.origin + "/Financial?type=withdraw";
        } else alert("Không tìm thấy dropdown Bank!");
        return;
      }
      arrow.click();

      setTimeout(() => {
        const spans = [...document.querySelectorAll("span.ng-star-inserted")];
        const target = j.bankName.toUpperCase();
        let found = spans.find(s => s.innerText.trim().toUpperCase() === target)
                 || spans.find(s => s.innerText.trim().toUpperCase().includes(target));
        if (found) found.click();

        setTimeout(() => {
          const cities = ["HCM", "HN", "HP", "DN", "CT"];
          const prov = document.querySelector("div.form-group:nth-child(2) > input:nth-child(2)")
                    || document.querySelectorAll(".form-group")[1]?.querySelector("input");
          if (prov) window._setNativeValue(prov, cities[Math.floor(Math.random() * cities.length)]);

          const acc = document.querySelector("div.form-group:nth-child(3) > input:nth-child(2)")
                   || document.querySelectorAll(".form-group")[2]?.querySelector("input");
          if (acc) window._setNativeValue(acc, j.bankAccount);

          setTimeout(() => {
            const btn = document.querySelector(".btn-submit");
            if (btn) btn.click();
            ta.value = "> Xong Bank: " + j.bankName;
          }, 500);
        }, 500);
      }, 500);
    } catch (e) { alert("Lỗi: " + e.message); }
  };
})();
