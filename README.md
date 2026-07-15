# Jaskaran Singh — AI Expert & Website Designer

A fast, SEO-first personal brand site. Pure HTML, CSS and JavaScript — **no frameworks, no build step, no dependencies**. Open `index.html` and it just works.

---

## 🚀 Going live (5 minutes)

The site is **ready to deploy right now**. Nothing false or broken is on it.

### Step 1 — Upload

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag the whole **`my website`** folder onto the page
3. Wait ~20 seconds. You get a live URL and free HTTPS.

### Step 2 — Claim your site name (don't skip this)

Netlify gives you a random name like `chipper-halva-a1b2c3.netlify.app`. Change it:

> **Site configuration → Site details → Change site name** → set it to **`jaskaran-singh`**

Your URL becomes `https://jaskaran-singh.netlify.app`, which is what every canonical tag in the site already points to.

**If `jaskaran-singh` is taken**, pick another name and then run this so the tags match your real address:

```bash
node set-domain.js https://your-actual-name.netlify.app
```

…then drag the folder onto Netlify again.

> **Why this matters:** canonical tags tell Google which URL is the real one. If they point at an address you don't own, you're telling Google *"the real page is somewhere else"* — and your live site may never get indexed. Same tags drive your WhatsApp and Instagram link previews.

### Step 3 — The contact form goes to WhatsApp (already working)

When someone submits the form, it opens WhatsApp with the enquiry pre-written and addressed to **+91 95013 47341**, formatted like this:

```
New enquiry from your website

Name: Priya Sharma
Email: priya@glowskin.in
Brand: GlowSkin
Country: India
Service: AI Calling Agent

What they're trying to achieve:
We miss 20+ calls a day at the clinic...
```

To change the number, edit `assets/js/main.js`:

```js
const WHATSAPP_NUMBER = "919501347341";  // country code + number, digits only
```

**⚠️ Read this — the one weakness of WhatsApp-only:** the message is composed in *your customer's* WhatsApp. **If they don't press Send, you get nothing** — and you'll never know they were there. People do get distracted at exactly that moment.

**Fix it with a free email backup.** Add a Formspree ID and every enquiry is *also* emailed to you the instant they submit, whether or not they press Send:

1. Sign up free at **[formspree.io](https://formspree.io)**
2. Create a form → you get `https://formspree.io/f/xayzbwqd`
3. Paste just the last part into `assets/js/main.js`:

```js
const FORMSPREE_ID = "xayzbwqd";   // <- your real ID
```

Leave it as-is and the form is WhatsApp-only, which works fine — you just carry that risk. Free tier is 50 submissions/month.

**Also worth knowing:** your number is now public on the site, so expect some spam. That's the trade for the lowest-friction contact method there is. If it becomes a problem, tell me and I'll put it behind a click instead.

### Step 4 — Get indexed by Google

Go to **[Google Search Console](https://search.google.com/search-console)** → add your site → submit **`sitemap.xml`**. Without this you're waiting months. With it, days.

---

## Later: your real domain

When you buy one, it's a single command:

```bash
node set-domain.js https://yourrealdomain.com
```

That rewrites all 137 URLs across every page, the sitemap and robots.txt, and refreshes the sitemap date. Then connect the domain in Netlify (**Domain management → Add domain**) and re-upload. Done.

---

## Testimonials — the honest version

**There are no testimonials on the site right now.** I removed the placeholders rather than ship `[ Client Name ]` cards or a "Rated 5.0" claim nothing backs up.

**I won't write fake reviews from invented people**, and you shouldn't publish them. Beyond the ethics, fake reviews are specifically illegal in India — Consumer Protection Act 2019 plus BIS standard **IS 19000:2022**, and the CCPA actively fines for it. The business risk is real and it lands on your name.

**The legitimate way to get real ones fast** (one WhatsApp message per client):

1. Message a past client: *"Really glad that worked out — mind if I put a short quote on my site? I'll write a draft, you just tell me if it's fair."*
2. Send me their name, brand, what you built, and roughly what they liked.
3. I'll write a polished quote, you send it to them, they approve it.
4. It's genuine, it's theirs, and it's on your site.

That's normal practice — you're doing the writing, they're doing the verifying.

Once you have real ones, tell me and I'll add them back **plus `AggregateRating` structured data** so Google can show ⭐ stars next to your search result. I deliberately left that schema out: publishing review markup for reviews that don't exist can get a site penalised.

**Your proof today is your portfolio** — both Instagram pages are linked from the hero, a dedicated "The proof" section, the footer and the contact page. A prospect can't fake-check a portfolio.

---

## Also worth editing

**The stats numbers.** In `index.html`, search for `EDIT THESE`. They currently say 6 services / 24-7 / 100% ownership / 24h reply — all true and safe, but swap in real figures (projects delivered, calls handled) once you have them. `data-count` is the number, `data-suffix` is what follows it.

---

## What's in here

```
├── index.html                  Home
├── services.html               Services hub
├── website-design.html         ─┐
├── website-development.html     │
├── ugc-ads.html                 ├─ one page per service,
├── ai-ads.html                  │  each targeting its own keyword
├── ai-calling-agent.html        │
├── ai-expert.html              ─┘
├── about.html                  About + your photo
├── contact.html                Contact form
├── 404.html
├── set-domain.js               Repoint the site at a new URL
├── sitemap.xml                 Submit to Google Search Console
├── robots.txt
├── site.webmanifest
└── assets/
    ├── css/main.css            Everything visual
    ├── js/main.js              Everything interactive  ← Formspree ID, line 12
    └── img/
        ├── jaskaran-singh.jpg  Your photo
        ├── og-cover.jpg        Social share preview (1200×630)
        └── favicon.svg
```

---

## SEO: what's already done

- **Unique title + meta description per page** — six service pages means you compete for six searches, not one
- **Structured data (JSON-LD)** — `Person`, `ProfessionalService`, `Service`, `FAQPage`, `BreadcrumbList`, `ItemList`. The FAQ markup can win extra vertical space in search results
- **Open Graph + Twitter cards** — proper preview card in WhatsApp, Instagram, LinkedIn
- **Semantic HTML** — one `<h1>` per page, correct heading order, real `<nav>`/`<main>`/`<footer>`
- **`sitemap.xml` + `robots.txt`**
- **Fast** — zero frameworks. Page speed is a confirmed ranking factor and most agency sites fail it
- **Accessible** — keyboard nav, skip link, ARIA labels, `prefers-reduced-motion`
- **Mobile-first** — verified no horizontal scroll from 360px up

**An honest word on ranking:** this foundation is genuinely strong — better than most agency sites. But technical SEO makes you *eligible* to rank, not ranked. That also needs time, content, and other sites linking to you. Your best shot is the service pages: long-tail terms like *"AI calling agent for small business"* are far more winnable than *"AI expert"* — and they attract people ready to buy.

---

## Editing basics

**Change text** — open the `.html` file, find the words, change them.

**Change colours** — CSS variables at the top of `assets/css/main.css`:

```css
--violet: #8b5cf6;
--cyan:   #22d3ee;
--pink:   #ec4899;
--bg:     #05060b;
```

Change those four and the whole site re-themes — icons, glows, buttons, gradients included.

**Swap your photo** — replace `assets/img/jaskaran-singh.jpg` (keep roughly 3:4). Then update the `width`/`height` attributes on the `<img>` tags in `index.html` and `about.html` to your new file's real pixel size — this prevents layout shift, which Google measures.

**Add a service** — copy a service page (e.g. `ai-ads.html`), change the content, then link it from the nav, drawer, footer, `services.html` and `sitemap.xml`.

---

## The 3D icons

Every service icon is a **real 3D object built from CSS transforms** — no images, no libraries, no Three.js:

| Icon | Service | Built from |
|---|---|---|
| Cube | Website Design | 6 faces with browser chrome |
| Layered planes | Website Development | 4 stacked planes of "code" |
| Phone | UGC Ads | Flipping device + orbiting ring |
| Card fan | AI Ads | 3 ad cards on a carousel |
| Voice orb | AI Calling Agent | Sphere + sonar pulses |
| Atom | AI Expert | 3 orbits + riding electrons |

Sized by one variable — `--s` on `.icon3d` (or `.icon3d--lg` / `.icon3d--xl`).

⚠️ **If you edit these:** the spheres (`.core`, `.nucleus`) are flat `div`s faking depth with a radial gradient. They must **never** sit inside an element that rotates on the Y axis — any Y rotation turns the disc edge-on and it collapses into a flat ellipse. That's why `.nucleus` lives outside `.icon3d__obj` and why `bobOrb` only translates. Comments in the CSS mark both.

Likewise, the halo behind your photo animates its gradient angle via `@property` rather than `transform: rotate` — rotating that box would sweep its bounding box out to the diagonal and shove the page width around ~100px on mobile.

---

## Verified before handover

- ✅ All 11 pages render with **zero console errors**, no failed requests, no broken images
- ✅ Every internal link and anchor resolves
- ✅ **No horizontal scroll** at 360 / 390 / 480 / 768 / 992 / 1200 / 1440 / 1600px (tested that a user *can't actually scroll sideways*, not just the reported number)
- ✅ Form: validation, honeypot, error recovery, unconfigured-Formspree guard
- ✅ Mobile drawer: opens, locks scroll, closes on Escape
- ✅ All scroll reveals fire; counters land on exact values even if frames drop
- ✅ Exactly one `<h1>` per page

## Browser support

Chrome, Edge, Firefox, Safari — current versions, desktop and mobile. Users with "reduce motion" enabled get the full site with animations disabled.
