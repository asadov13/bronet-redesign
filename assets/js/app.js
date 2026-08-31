/* BronEt — kiçik, ölçülü interaktivlik. Kitabxana yoxdur. */
(function () {
  "use strict";
  const nf = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Header — scroll-da bərkiyir */
  const fab = document.querySelector(".fab");
  const hdr = document.querySelector(".hdr");
  if (fab && (!hdr || hdr.dataset.static === "true")) {
    const showFab = () => fab.classList.toggle("is-vis", window.scrollY > 420);
    showFab();
    window.addEventListener("scroll", showFab, { passive: true });
  }
  if (hdr && hdr.dataset.static !== "true") {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        hdr.classList.toggle("hdr--solid", window.scrollY > 24);
        if (fab) fab.classList.toggle("is-vis", window.scrollY > 420);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* 2. Mobil menyu */
  const burger = document.querySelector(".burger");
  const mob = document.querySelector(".mobmenu");
  if (burger && mob) {
    burger.addEventListener("click", () => {
      const open = mob.dataset.open === "true";
      mob.dataset.open = String(!open);
      burger.setAttribute("aria-expanded", String(!open));
    });
    mob.addEventListener("click", (e) => {
      if (e.target.tagName === "A") { mob.dataset.open = "false"; burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* 3. Görünüşə daxil olanda bir dəfəlik açılma (staggered) */
  const items = document.querySelectorAll("[data-reveal]");
  if (items.length && !reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el, i) => {
      const group = el.parentElement;
      const idx = group ? [...group.children].indexOf(el) : i;
      el.style.setProperty("--d", Math.min(idx, 5) * 70 + "ms");
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  /* 4. Bəyən düyməsi */
  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (!fav) return;
    e.preventDefault();
    const on = fav.getAttribute("aria-pressed") === "true";
    fav.setAttribute("aria-pressed", String(!on));
    fav.setAttribute("aria-label", on ? "Bəyəndiklərimə əlavə et" : "Bəyəndiklərimdən çıxar");
  });

  /* 5. Çip filtrləri (tək seçim) */
  document.querySelectorAll("[data-chips]").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      group.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
    });
  });

  /* 6. Tarix sahələri — minimum bugün, çıxış > giriş */
  const iso = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const ci = document.querySelector('[data-checkin]');
  const co = document.querySelector('[data-checkout]');
  if (ci && co) {
    ci.min = iso(today); co.min = iso(new Date(today.getTime() + 864e5));
    const sync = () => {
      if (!ci.value) return;
      const next = new Date(ci.value); next.setDate(next.getDate() + 1);
      co.min = iso(next);
      if (co.value && co.value <= ci.value) co.value = iso(next);
      calcStay();
    };
    ci.addEventListener("change", sync);
    co.addEventListener("change", calcStay);
  }

  /* 7. Rezervasiya hesablaması — şəffaf qiymət (Baymard: gizli xərc olmasın) */
  function calcStay() {
    const box = document.querySelector("[data-booking]");
    if (!box || !ci || !co || !ci.value || !co.value) return;
    const nights = Math.max(1, Math.round((new Date(co.value) - new Date(ci.value)) / 864e5));
    const rate = Number(box.dataset.rate || 128);
    const fee = Math.round(rate * nights * 0.06);
    const tax = Math.round(rate * nights * 0.03);
    const fmt = (n) => "₼" + nf(n);
    box.querySelectorAll("[data-nights]").forEach((n) => (n.textContent = nights));
    const set = (k, v) => { const el = box.querySelector('[data-sum="' + k + '"]'); if (el) el.textContent = v; };
    set("base", fmt(rate * nights));
    set("fee", fmt(fee));
    set("tax", fmt(tax));
    set("total", fmt(rate * nights + fee + tax));
    box.querySelectorAll("[data-needs-dates]").forEach((el) => el.removeAttribute("hidden"));
    box.querySelectorAll("[data-no-dates]").forEach((el) => el.setAttribute("hidden", ""));
  }
  calcStay();

  /* 8. Ev sahibi gəlir kalkulyatoru */
  const calc = document.querySelector("[data-calc]");
  if (calc) {
    const price = calc.querySelector("[data-calc-price]");
    const nights = calc.querySelector("[data-calc-nights]");
    const out = calc.querySelector("[data-calc-out]");
    const pv = calc.querySelector("[data-calc-pricev]");
    const nv = calc.querySelector("[data-calc-nightsv]");
    const upd = () => {
      const p = Number(price.value), n = Number(nights.value);
      pv.textContent = "₼" + p;
      nv.textContent = n;
      out.textContent = "₼" + nf(p * n * 0.88);
    };
    price.addEventListener("input", upd);
    nights.addEventListener("input", upd);
    upd();
  }

  /* 9. Qalereya — kiçik şəkilə klikləyəndə əsas şəkil dəyişir */
  const gal = document.querySelector("[data-gallery]");
  if (gal) {
    const main = gal.querySelector("[data-gallery-main] img");
    gal.addEventListener("click", (e) => {
      const thumb = e.target.closest("[data-gallery-thumb] img");
      if (!thumb || !main) return;
      const a = main.getAttribute("src");
      main.setAttribute("src", thumb.getAttribute("src"));
      thumb.setAttribute("src", a);
    });
  }
})();

/* 10. Mobil filtr paneli */
(function () {
  const btn = document.querySelector("[data-filter-toggle]");
  const panel = document.querySelector(".filters");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const open = panel.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    if (open) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

/* 11. Şifrəni göstər / gizlət */
document.querySelectorAll("[data-pwd]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const inp = btn.parentElement.querySelector("input");
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    btn.setAttribute("aria-label", show ? "Şifrəni gizlət" : "Şifrəni göstər");
  });
});

/* 12. Seqment düymələri (Qonaq / Ev sahibi) */
document.querySelectorAll("[data-segment]").forEach((seg) => {
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
  });
});

/* 13. Əmlak yerləşdirmə sehrbazı */
(function () {
  const wiz = document.querySelector("[data-wizard]");
  if (!wiz) return;
  const panels = [...wiz.querySelectorAll("[data-panel]")];
  const chips = [...wiz.querySelectorAll("[data-step-chip]")];
  const bar = wiz.querySelector("[data-wiz-bar]");
  const last = chips.length;
  let cur = 1;

  const out = (k) => wiz.querySelector('[data-live-out="' + k + '"]');

  function show(n) {
    cur = n;
    panels.forEach((p) => p.toggleAttribute("hidden", p.dataset.panel !== String(n)));
    chips.forEach((c) => {
      const i = Number(c.dataset.stepChip);
      c.dataset.state = i === n ? "active" : i < n ? "done" : "";
    });
    if (bar) bar.style.width = Math.round((Math.min(n, last) / last) * 100) + "%";
    const top = wiz.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
  }

  wiz.addEventListener("click", (e) => {
    if (e.target.closest("[data-wiz-next]")) show(Math.min(cur + 1, last));
    if (e.target.closest("[data-wiz-prev]")) show(Math.max(cur - 1, 1));
    if (e.target.closest("[data-wiz-submit]")) {
      panels.forEach((p) => p.toggleAttribute("hidden", p.dataset.panel !== "done"));
      chips.forEach((c) => (c.dataset.state = "done"));
      if (bar) bar.style.width = "100%";
      wiz.querySelector(".wizsteps").scrollLeft = 9999;
      window.scrollTo({ top: wiz.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
    }
    const step = e.target.closest("[data-step-count]");
    if (step) {
      const o = wiz.querySelector("#" + step.dataset.target);
      const v = Math.max(1, Number(o.textContent) + Number(step.dataset.stepCount));
      o.textContent = v;
      syncMeta();
    }
    const chip = e.target.closest("[data-step-chip]");
    if (chip && Number(chip.dataset.stepChip) < cur) show(Number(chip.dataset.stepChip));
  });

  function syncMeta() {
    const g = wiz.querySelector("#cGuest").textContent;
    const b = wiz.querySelector("#cBed").textContent;
    const w = wiz.querySelector("#cBath").textContent;
    if (out("meta")) out("meta").textContent = `${g} qonaq · ${b} yataq · ${w} vanna`;
  }

  function syncLoc() {
    const r = wiz.querySelector("#region").value;
    const v = wiz.querySelector("#village").value.trim();
    if (out("loc")) out("loc").textContent = v ? v + ", " + r : r;
  }

  wiz.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "title" && out("title")) out("title").textContent = t.value.trim() || "Elanın başlığı";
    if (t.id === "price" && out("price")) out("price").textContent = "₼" + (t.value || 0);
    if (t.id === "village" || t.id === "region") syncLoc();
    if (t.dataset.live === "type" && out("type")) out("type").textContent = t.value;
    if (t.dataset.amen !== undefined && out("amen")) {
      const n = wiz.querySelectorAll("[data-amen]:checked").length;
      out("amen").textContent = n ? n + " imkan seçilib" : "İmkan seçilməyib";
    }
  });
  wiz.addEventListener("change", (e) => {
    if (e.target.id === "region") syncLoc();
    if (e.target.dataset.live === "type" && out("type")) out("type").textContent = e.target.value;
  });

  syncMeta();
  syncLoc();
})();
