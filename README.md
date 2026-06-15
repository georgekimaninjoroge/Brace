<p align="center">
  <img src="assets/banner.png" alt="Brace" width="100%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/getbrace?style=flat-square&color=8F8DF6&labelColor=1a1814" alt="npm version"/>
  <img src="https://img.shields.io/npm/dm/getbrace?style=flat-square&color=8F8DF6&labelColor=1a1814" alt="npm downloads"/>
  <img src="https://img.shields.io/badge/license-MIT-8F8DF6?style=flat-square&labelColor=1a1814" alt="MIT license"/>
  <img src="https://img.shields.io/badge/zero_dependencies-✓-8F8DF6?style=flat-square&labelColor=1a1814" alt="zero dependencies"/>
  <img src="https://img.shields.io/badge/CDN-jsDelivr-8F8DF6?style=flat-square&labelColor=1a1814" alt="CDN jsDelivr"/>
  <img src="https://img.shields.io/badge/works-everywhere-8F8DF6?style=flat-square&labelColor=1a1814" alt="works everywhere"/>
</p>

# Brace

**One script tag. WhatsApp, SEO, analytics and cookie consent. Everything a web agency charges for, free.**

## The Problem

A small business owner gets a quote from their web agency:

```
WhatsApp integration    $40
Google Analytics setup  $25
SEO implementation      $60
Cookie consent banner   $30
Contact form            $40
Speed optimisation      $40
──────────────────────────
Total                   $235
```

Every single one of those line items is a script tag or a meta tag. Brace ships all of them free in one line of HTML.

## Install

Paste this before `</body>` on any website:

```html
<script
  src="https://cdn.jsdelivr.net/npm/getbrace/brace.js"
  data-whatsapp="254712345678"
  data-business="My Business Name"
  async>
</script>
```

Not sure what to put where? Use the **[visual configurator](https://georgekimaninjoroge.github.io/brace/)** — fill in your details, copy your tag.

Or install via npm:

```bash
npm install getbrace
```

## What You Get

| Feature | What it does |
|---|---|
| **WhatsApp widget** | Floating chat button, pre-filled message, auto-popup bubble |
| **SEO meta tags** | og tags, canonical, description, viewport — injected if missing |
| **Speed** | Lazy-load images, deferred scripts, preconnect hints |
| **Cookie consent** | GDPR-compliant banner, remembers user choice |
| **Google Analytics** | GA4 loaded lazily — doesn't slow your page |
| **Facebook Pixel** | Loaded lazily, same pattern |
| **Contact forms** | Enhances any form with EmailJS or mailto fallback |
| **Broken link detector** | Highlights broken links on localhost during development |

## Configuration

All config via `data-*` attributes. Everything is optional.

```html
<script
  src="https://cdn.jsdelivr.net/npm/getbrace/brace.js"

  data-whatsapp="254712345678"           <!-- Your WhatsApp number with country code -->
  data-message="Hi, I'd like to order"   <!-- Pre-filled message -->
  data-business="My Business Name"       <!-- Shown in chat bubble -->
  data-color="#7B7FE8"                   <!-- Accent colour (default: WhatsApp green) -->
  data-position="right"                  <!-- 'right' or 'left' -->

  data-ga="G-XXXXXXXXXX"                <!-- Google Analytics 4 ID -->
  data-pixel="XXXXXXXXXXXXXXXXX"         <!-- Facebook Pixel ID -->

  data-emailjs="your_public_key"         <!-- EmailJS public key -->
  data-emailjs-service="service_id"      <!-- EmailJS service ID -->
  data-emailjs-template="template_id"    <!-- EmailJS template ID -->

  data-disable="pixel,linkcheck"         <!-- Disable specific modules -->

  async>
</script>
```

### Disable modules you don't need

```html
data-disable="ga,pixel,cookie,forms,linkcheck"
```

## Contact Forms

Add `data-brace-form` to any existing `<form>`:

```html
<form data-brace-form>
  <input name="name" placeholder="Your name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message..."></textarea>
  <button type="submit">Send</button>
</form>
```

With EmailJS configured → sends directly, no backend needed.  
Without EmailJS → opens the user's mail client as a fallback.

## Lazy Images

Add `data-src` instead of `src` on any image:

```html
<img data-src="your-image.jpg" alt="...">
```

Brace loads it only when the user scrolls near it — critical on slow mobile connections.

## How It Works

```
One script tag
    │
    ├── SEO meta tags injected if missing
    ├── Images set to lazy-load
    ├── Scripts deferred automatically
    ├── WhatsApp button rendered (bottom-right)
    ├── Cookie banner shown on first visit
    ├── GA4 loaded after first user interaction
    ├── Facebook Pixel loaded after first scroll
    └── Contact forms enhanced with success/error states
```

## Performance

Brace is designed to make your site **faster**, not heavier:

- Zero dependencies
- Single file — `< 12KB` minified
- Analytics load only after user interaction
- Everything non-critical is deferred or lazy
- Does not block page render

## File Map

```
brace/
  brace.js           Main script
  studio.html        Visual tag builder for non-developers
  package.json       npm config
  assets/            Banner + logo
  README.md
```

## Requirements

- Any website with access to the HTML source
- Works on plain HTML, WordPress (paste in footer via Appearance → Theme Editor), and any CMS that allows custom scripts
- No server, no account, no API key required for core features

## License

MIT © George Kimani Njoroge