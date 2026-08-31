/* BronEt köməkçisi — sadə qayda əsaslı bot. Server və kitabxana yoxdur. */
(function () {
  "use strict";
  const root = document.querySelector("[data-chat]");
  if (!root) return;

  const log = root.querySelector("[data-chat-log]");
  const quick = root.querySelector("[data-chat-quick]");
  const form = root.querySelector("[data-chat-form]");
  const input = form.querySelector("input");
  const toggle = root.querySelector("[data-chat-toggle]");
  const closeBtn = root.querySelector("[data-chat-close]");

  const WA = "https://wa.me/994514536143";

  /* Bilik bazası — açar sözlər → cavab + təklif olunan növbəti suallar */
  const KB = [
    { k: ["salam", "salamlar", "hey", "narm"], a: "Salam! 👋 Rezervasiya, ödəniş və ya elan yerləşdirmə ilə bağlı hər şeyi soruşa bilərsiniz.",
      c: ["Necə bron edim?", "Ödəniş necə olur?", "Elan yerləşdirmək"] },
    { k: ["bron", "rezerv", "sifariş", "necə bron"], a: "Bron üç addımdır:<br>1️⃣ Tarix və qonaq sayını seçin<br>2️⃣ Tarif planını seçin<br>3️⃣ Sahibkar təsdiqləsin — adətən <b>1 saat</b> ərzində.<br>Kart məlumatı tələb olunmur.",
      c: ["Ödəniş necə olur?", "Ləğvetmə şərti", "Əmlaklara bax"] },
    { k: ["ödəniş", "odenis", "pul", "kart", "nağd", "depozit"], a: "Ödəniş <b>əmlakda, yerində</b> aparılır — nağd və ya kartla. Saytda kart nömrəsi və ya depozit istənilmir.",
      c: ["Vergi qiymətə daxildir?", "Ləğvetmə şərti"] },
    { k: ["vergi", "rüsum", "xidmət haqqı", "yekun", "toplam", "gizli"], a: "Kartlarda göstərilən qiymət gecəlik tarifdir. Tarixləri seçdikdən sonra rezervasiya panelində <b>xidmət haqqı</b> və <b>vergi</b> ayrıca sətirlə görünür — yekun məbləği təsdiqdən əvvəl tam görürsünüz.",
      c: ["Necə bron edim?", "Ləğvetmə şərti"] },
    { k: ["ləğv", "legv", "qaytar", "imtina", "iptal"], a: "Standart şərt: girişə <b>7 gün</b> qalmışa qədər ləğv pulsuzdur, sonra məbləğin 50%-i tutulur. «Xüsusi təklif» tarifləri qaytarılmayandır — şərt hər tarifin altında yazılır.",
      c: ["Ödəniş necə olur?", "Operatorla danış"] },
    { k: ["elan", "yerləşdir", "ev sahibi", "sahibkar", "əmlakımı", "qeyd et"], a: "Elan yerləşdirmək <b>pulsuzdur</b>. Forma təxminən 15 dəqiqə çəkir, yoxlama 24 saat ərzində bitir. <a href=\"list-property.html\">Buradan başlaya bilərsiniz →</a>",
      c: ["Nə qədər qazana bilərəm?", "Komissiya nə qədərdir?"] },
    { k: ["qazan", "gəlir", "kalkulyator", "nə qədər pul"], a: "Gəlir qiymətinizdən və dolu gecə sayından asılıdır. <a href=\"host.html#hesabla\">Kalkulyatordan</a> təxmini aylıq məbləği hesablaya bilərsiniz.",
      c: ["Komissiya nə qədərdir?", "Elan yerləşdirmək"] },
    { k: ["komissiya", "faiz", "xidmət haqqı sahibkar"], a: "Elan yerləşdirmə və saxlama pulsuzdur. Xidmət haqqı yalnız <b>baş tutmuş</b> rezervasiyadan tutulur — boş gecə üçün heç nə ödəmirsiniz.",
      c: ["Elan yerləşdirmək", "Operatorla danış"] },
    { k: ["qeydiyyat", "hesab", "profil", "daxil", "login", "şifrə"], a: "Hesab yaratmaq 2 dəqiqədir — yalnız ad, nömrə və şifrə. <a href=\"register.html\">Qeydiyyat →</a> · <a href=\"login.html\">Daxil ol →</a>",
      c: ["Necə bron edim?", "Operatorla danış"] },
    { k: ["a-frame", "aframe", "ev", "qəbələ", "qusar", "şahdağ", "quba", "harda", "bölgə"], a: "Hazırda 7 bölgədə əmlak var: Qəbələ, Qusar/Şahdağ, Quba, Şamaxı, İsmayıllı, Lənkəran və Bakı. <a href=\"search.html\">Hamısına baxın →</a>",
      c: ["Necə bron edim?", "Qiymətlər necədir?"] },
    { k: ["qiymət", "ucuz", "baha", "neçəyə"], a: "Qiymətlər gecəlik ₼110-dan başlayır. Mövsümə və qalış müddətinə görə endirimlər olur — «Erkən rezervasiya» və «Uzun qalış» endirimlərinə diqqət edin.",
      c: ["Vergi qiymətə daxildir?", "Əmlaklara bax"] },
    { k: ["transfer", "yol", "çatmaq", "avtobus"], a: "Bəzi əmlaklar <b>pulsuz transfer</b> təklif edir — kartda «Pulsuz transfer» nişanı ilə göstərilir. Detalları sahibkarla dəqiqləşdirmək olar.",
      c: ["Əmlaklara bax", "Operatorla danış"] },
    { k: ["heyvan", "pet", "it", "pişik"], a: "Ev heyvanı qaydası əmlakdan asılıdır — elan səhifəsindəki «Qalma şərtləri» bölməsində yazılır. Axtarışda «Ev heyvanı olar» filtrindən istifadə edin.",
      c: ["Əmlaklara bax"] },
    { k: ["operator", "insan", "zəng", "əlaqə", "whatsapp", "nömrə", "telefon"], a: "Komanda hər gün <b>09:00–21:00</b> işləyir.<br>📞 +994 51 453 61 43<br>✉️ info@bronet.co.az<br><a href=\"" + WA + "\">WhatsApp-dan yazın →</a>",
      c: ["Necə bron edim?", "Ödəniş necə olur?"] },
    { k: ["sağ ol", "təşəkkür", "thanks", "merci"], a: "Dəyməz! 🌲 Başqa sualınız olsa, buradayam.",
      c: ["Əmlaklara bax", "Elan yerləşdirmək"] },
  ];

  const START_CHIPS = ["Necə bron edim?", "Ödəniş necə olur?", "Ləğvetmə şərti", "Elan yerləşdirmək", "Operatorla danış"];
  const FALLBACK = "Bunu dəqiq bilmirəm 🤔 Komandaya birbaşa yazsam daha sürətli olar — <a href=\"" + WA + "\">WhatsApp-dan soruşun →</a><br>Və ya aşağıdakılardan birini seçin.";

  const norm = (t) => t.toLowerCase()
    .replace(/ə/g, "e").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ç/g, "c");

  function answer(text) {
    const q = norm(text);
    let best = null, score = 0;
    KB.forEach((e) => {
      const hits = e.k.filter((k) => q.includes(norm(k))).length;
      if (hits > score) { score = hits; best = e; }
    });
    return best || { a: FALLBACK, c: START_CHIPS.slice(0, 3) };
  }

  function bubble(html, who) {
    const d = document.createElement("div");
    d.className = "msg msg--" + who;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function chips(list) {
    quick.innerHTML = "";
    (list || []).forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = t;
      b.addEventListener("click", () => ask(t));
      quick.appendChild(b);
    });
  }

  function typing() {
    const d = document.createElement("div");
    d.className = "typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  let busy = false;
  function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    bubble(text.replace(/</g, "&lt;"), "me");
    chips([]);
    const t = typing();
    const res = answer(text);
    setTimeout(() => {
      t.remove();
      bubble(res.a, "bot");
      chips(res.c || START_CHIPS.slice(0, 3));
      busy = false;
    }, 520 + Math.random() * 380);
  }

  let greeted = false;
  function open() {
    root.dataset.open = "true";
    toggle.setAttribute("aria-expanded", "true");
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        bubble("Salam! Mən <b>BronEt köməkçisiyəm</b> 🌲<br>Rezervasiya, ödəniş və elan yerləşdirmə ilə bağlı suallarınıza cavab verirəm.", "bot");
        chips(START_CHIPS);
      }, 260);
    }
    setTimeout(() => input.focus(), 320);
  }
  function close() {
    root.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => (root.dataset.open === "true" ? close() : open()));
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && root.dataset.open === "true") close(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    ask(v);
  });
})();
