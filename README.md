# BronEt — redizayn (statik prototip)

`bronet.co.az` saytının **təkmilləşdirilmiş redizaynı**. Struktur və məzmun saxlanılıb, dizayn dili, informasiya iyerarxiyası və rezervasiya axını yenidən qurulub.

## Fayllar

```
bronet-redesign/
├── index.html          Ana səhifə  (hero + axtarış, bölgələr, necə işləyir, FAQ)
├── search.html         Axtarış nəticələri (filtrlər, xəritə, sıralama, siyahı)
├── property.html       Elan detalı (qalereya, tariflər, qaydalar, rezervasiya paneli)
├── host.html           Sahibkar səhifəsi (gəlir kalkulyatoru, proses, FAQ)
├── login.html          Daxil ol
├── register.html       Qeydiyyat (qonaq / ev sahibi seçimi ilə)
├── list-property.html  Əmlak yerləşdirmə sehrbazı — 6 addım + canlı önizləmə
└── assets/
    ├── css/style.css   Bütün dizayn sistemi — tokenlər, komponentlər, motion
    ├── js/app.js       Vanilla JS: header, motion, filtrlər, rezervasiya hesablaması, sehrbaz
    ├── js/chat.js      BronEt köməkçisi — qayda əsaslı chat bot
    └── img/*.svg       6 ədəd A-Frame mənzərə illüstrasiyası (offline işləyir)
```

**Açmaq üçün:** `index.html` faylına iki dəfə klikləyin — server, build, `npm install` lazım deyil.

---

## 1. Rəqib analizi

| Platforma | Nəyi yaxşı edir | Buradan nə götürüldü |
|---|---|---|
| **Landfolk** (DK, A-frame/dağ evləri) | Tünd yaşıl brend + serif başlıq; tam-en foto hero; hero üzərində **tək sətirli** axtarış paneli; hero altında etibar zolağı (Trustpilot, pulsuz ləğv, dəstək) | Foto-öncüllü hero, panelin hero-nun aşağı kənarına «oturması», etibar zolağı, kurasiya olunmuş kart cərgələri |
| **Airbnb** | Kateqoriya çipləri; kartlarda sabit şəkil nisbəti; ürək düyməsi; təmiz qiymət iyerarxiyası | Kateqoriya çipləri, 4:3 sabit media, `iconbtn` bəyən düyməsi, qiymət bloku |
| **Booking.com** | Filtrlərdə nəticə sayı; «Sırala» seçimi; sətir-kartda sağ tərəfdə reytinq+qiymət+CTA sütunu; tarif planlarının cədvəl məntiqi | Axtarış səhifəsinin bütün strukturu, `rowcard`-ın sağ sütunu, tarif planı kartları |
| **Plum Guide** | Redaksiya seçimi kimi mövqelənmə, az sayda amma yaxşı təqdim olunmuş elan | «Tövsiyyə olunanlar» bölməsinin dili — 2 real elanla da az görünməmək üçün |
| **oteltap.az / turlar.az** (yerli) | AZ dilində tanış terminologiya, WhatsApp ilə birbaşa əlaqə | WhatsApp CTA saxlanılıb, amma dizayna inteqrasiya olunub |

**Baymard Institute** (otel/kirayə UX araşdırması) prinsipləri tətbiq olundu:

- Yekun məbləğ **təsdiqdən əvvəl** tam görünür — vergi və xidmət haqqı ayrıca sətirdir (gizli xərc tərk etmənin əsas səbəbidir).
- Filtrlərdə nəticə sayı göstərilir.
- Kartlarda qiymət, reytinq və əsas imkanlar eyni yerdə, eyni ardıcıllıqla.
- Ləğvetmə şərti həm kartda, həm tarifin altında, həm rezervasiya panelində təkrarlanır.

---

## 2. Mövcud saytın auditi → nə dəyişdi

| Problem (bronet.co.az) | Həll |
|---|---|
| Hero — düz yaşıl blok, foto yoxdur; sayt «boş» görünür | Tam-en mənzərə + qatlı gradient scrim; başlıqda serif kursiv vurğusu |
| Axtarış paneli 4 böyük rəngli qutu (yaşıl/narıncı) — hansının nə olduğu aydın deyil | Tək sətirli, ayırıcı xətli panel; hər sahədə kiçik CAPS etiket; yalnız bir narıncı deyil, **bir** yaşıl CTA |
| Kartlarda 6-7 nişan yan-yana — «badge şorbası» | Şəkil üzərində maksimum 2 nişan, qalanı strukturlaşdırılmış sətirlərə bölünüb (otaq/qonaq → imkanlar → qiymət) |
| Eyni 2 elan 3 dəfə təkrarlanır | Bölmələr fərqli məzmunla doldurulub + bölgə kəşfi bölməsi əlavə olunub |
| Footer-dəki `#faq` linki heç yerə aparmır | Real FAQ bölməsi (5 sual, accordion) |
| Axtarış/filtr səhifəsi yoxdur | Tam `search.html`: qiymət, əmlak növü, şərtlər, imkanlar, reytinq filtrləri + xəritə + sıralama + səhifələmə |
| Detal səhifəsində qiymət yalnız «Tarix seçin» yazır, yekun görünmür | Rezervasiya paneli tarix seçilən kimi gecə sayını, xidmət haqqını, vergini və **yekun məbləği** hesablayır |
| «Hələ rəy yoxdur» boş sahə kimi qalır | Dəvətedici boş-hal (empty state) — ilk rəyi yazmağa çağırış |
| Sistem şrifti (SF/Segoe/Roboto) — kimliksiz | **Archivo** (başlıq) + **Manrope** (interfeys) — serif yoxdur |
| WhatsApp düyməsi «Axtar» düyməsinin üstünü örtür | Düymə yalnız 420px scroll-dan sonra görünür |
| Mobil menyu, sticky rezervasiya paneli yoxdur | Burger menyu, mobil alt rezervasiya zolağı, mobil filtr paneli |

---

## 3. Dizayn sistemi

**Rəng.** Brend yaşılı `#00A63E` saxlanılıb (tanınırlıq), üstünə tünd meşə mürəkkəbi `#0B2F22` (başlıq, footer, tünd zolaqlar) və isti kağız fonu `#FBF9F4` əlavə olunub. Narıncı `#F54900` yalnız **endirim və təcililik** üçün — hər yerdə deyil.

**Tipoqrafiya.** Serif yoxdur. Başlıqlar **Archivo** (600/700, `letter-spacing: -.035em`), interfeys **Manrope** (400–700). Hər iki şrift yüklənir və bir-birinin fallback-ıdır — birində olmayan Azərbaycan hərfi (ə, ğ, ı, ş) digərinə düşür, sistem şrifti isə son ehtiyatdır. Bütün rəqəmlər `tabular-nums`. Başlıqlarda `text-wrap: balance`, mətndə `pretty`.

**Kart dizaynı.** Sadə və oxunaqlı, Airbnb/Landfolk məntiqi: çərçivəsiz kart, 4:3 şəkil, şəkil üzərində **maksimum bir** nişan (endirim varsa endirim, yoxsa əsas xüsusiyyət) + bəyən düyməsi. Mətn hissəsi həmişə eyni beş sətir:

```
Başlıq                    ★ 4,8 (24)
Vəndam, Qəbələ
Bütöv ev · 2 yataq · 6 qonaq
₼185  ₼205  / gecə
Kamin və terras            ← tək yaşıl üstünlük
```

Bütün kartlar eyni hündürlükdə oxunur; nişan yığını, çek işarəli siyahı və ikiqat qiymət bloku silinib.

**Ölçü.** 4px şəbəkə (`--s-1` … `--s-24`), `clamp()` ilə axıcı tipoqrafik pilləkən.

**Radius.** Konsentrik qayda: xarici radius = daxili radius + padding (kart 28px, daxili element 20px, düymə 999px).

**Kölgə.** Sərhəd əvəzinə 4 pilləli təbəqəli kölgə (`--sh-1` … `--sh-4`).

## 4. Motion — ölçülü

Kitabxana yoxdur, hamısı CSS. Prinsip: **bir yaxşı orkestrləşdirilmiş an > on dənə səpələnmiş mikro-animasiya**.

- Səhifə açılışında hero elementləri 90ms fərqlə qalxır (yalnız bir dəfə).
- Bölmələr görünüşə daxil olanda 14px qalxma + fade (IntersectionObserver, elementə bir dəfə).
- Header 24px scroll-dan sonra blur + fon alır.
- Kart hover: şəkil `scale(1.045)`, kart 3px qalxır, kölgə dərinləşir.
- Düymələrdə basma hissi: `scale(0.96)`.
- `transition: all` heç yerdə yoxdur — hər keçiddə property adları açıq yazılıb.
- `prefers-reduced-motion` tam dəstəklənir — bütün animasiyalar söndürülür.

## 5. Əlçatanlıq

Skip-link, `aria-label`/`aria-pressed`/`aria-current`, semantik `<header> <main> <section> <footer>`, 44×44px minimum toxunma sahəsi, görünən fokus halqası, `<details>` ilə klaviaturadan işləyən FAQ, alt mətnlər.

## 6. Qeydlər

- **Real məzmun:** `Hotel` və `Merdekan` elanları saytdakı real elanlardır; şəkilləri bronet CDN-dən yüklənir, internet olmadıqda avtomatik illüstrasiyaya keçir (`onerror` fallback).
- **Demo məzmun:** Qəbələ, Qusar, Quba, Şamaxı, İsmayıllı, Lənkəran elanları və reytinqlər **prototip üçün nümunə məlumatdır** — real elan deyil. Canlıya çıxmazdan əvvəl real bazadan doldurulmalıdır.
- İllüstrasiyalar əl ilə yazılmış SVG-dir (hər biri ~2 KB) — real foto əldə olunanda `assets/img/` içindəki fayllar əvəz olunur.
- Səhifələr statikdir; Next.js-ə köçürərkən `header`/`footer` komponentə, `card`/`rowcard`/`tariff` isə ayrıca komponentlərə çevrilir — CSS olduğu kimi qalır.


## 7. Chat bot (`assets/js/chat.js`)

Bütün səhifələrdə sağ aşağıda **BronEt köməkçisi** var. Server, API və kitabxana yoxdur — açar söz əsaslı, tamamilə brauzerdə işləyən bot:

- 15 mövzuluq bilik bazası: bron prosesi, ödəniş, vergi/xidmət haqqı, ləğvetmə, elan yerləşdirmə, komissiya, gəlir, qeydiyyat, bölgələr, qiymətlər, transfer, ev heyvanı, operator əlaqəsi.
- Açar sözlər Azərbaycan hərflərinə normallaşdırılır (`ə→e`, `ş→s`…), yəni «odenis», «ödəniş», «Ödəniş necə olur?» — hamısı eyni cavabı tapır.
- Hər cavabdan sonra **təklif olunan növbəti suallar** çip kimi çıxır; cavab tapılmayanda WhatsApp-a yönləndirir.
- Yazma indikatoru, mesaj animasiyası, Escape ilə bağlama, `aria-live` ilə ekran oxuyucu dəstəyi.

Real bota keçid: `KB` massivini API cavabı ilə əvəz etmək kifayətdir — qalan interfeys olduğu kimi qalır.

## 8. Auth və elan sehrbazı

- `login.html` / `register.html` — iki sütunlu düzülüş (form + brend paneli), şifrə göstər/gizlət, «Qonaq / Ev sahibi» seqmenti, nömrə və email ilə giriş variantları.
- `list-property.html` — 6 addımlı sehrbaz: əmlak növü → yer → otaqlar → imkanlar → şəkillər → qiymət, sonra «yoxlamaya göndərildi» ekranı. Sağda **canlı önizləmə kartı** var: başlıq, bölgə, qonaq/yataq sayı, qiymət və seçilmiş imkanlar yazdıqca dəyişir — sahibkar elanının axtarışda necə görünəcəyini dərhal görür.
- **Diqqət:** bu səhifələr dizayn prototipidir. Formalar heç bir məlumat göndərmir və saxlamır; hər birində bu barədə görünən qeyd var. Canlıya çıxarmazdan əvvəl real backend, HTTPS, şifrə hashing və rate-limit tələb olunur.
