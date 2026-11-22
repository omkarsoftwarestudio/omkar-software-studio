# Omkar Software Studio — website

## Project overview

A complete, responsive, multi-page marketing website for Omkar Software Studio, a custom software development company based in Mumbai, India.

Built with plain HTML5, CSS and vanilla JavaScript. No frameworks, build tools, package managers or JavaScript libraries are used. Graphics are inline SVG or CSS; the only external resource is Google Fonts.

Features include a sticky responsive navigation with mobile dropdowns, dark mode with saved preference, scroll-reveal animations, FAQ accordions, a validated contact form, accessible markup, and SEO metadata on every page.

## Folder structure

```
omkar/
├── index.html                  Home
├── about.html                  About Us
├── contact.html                Contact Us
├── services.html               Services overview
├── industries.html             Industries overview
├── privacy.html                Privacy Policy (placeholder text)
├── terms.html                  Terms and Conditions (placeholder text)
├── 404.html                    Friendly not-found page
├── services/
│   ├── web-development.html
│   ├── mobile-app-development.html
│   ├── custom-business-software.html
│   ├── ai-and-automation.html
│   ├── cloud-and-devops.html
│   └── maintenance-and-support.html
├── industries/
│   ├── financial-services.html
│   ├── healthcare.html
│   ├── manufacturing.html
│   ├── retail-and-ecommerce.html
│   ├── education.html
│   └── logistics-and-transport.html
├── css/style.css               Design system and all component styles
├── js/main.js                  All interactive behaviour
├── assets/favicon.ico          Favicon (16/32/48) + PNG sizes
├── sitemap.xml
├── robots.txt
└── README.md
```

## How to run locally

1. Open `index.html` directly in any modern browser, or
2. Install the **Live Server** extension in VS Code, open this folder, right-click `index.html` and choose **Open with Live Server**.
3. Use the navigation to move between pages; all links use relative paths and work from any folder depth.

No installation, server configuration or build step is required. Internet access is needed only to load Google Fonts.

## Before-launch replacement checklist

Search all files for `[PLACEHOLDER:` to find every item below.

- [ ] **Contact details** — street address and state / pin code in `contact.html` and the footer. Email and phone are set to `omkarenterprises1330@gmail.com` and `+91 91373 34292`.
- [ ] **Social links** — LinkedIn currently uses the fallback URL `https://www.linkedin.com/` in every footer, the LinkedIn contact card, and Organization `sameAs`; replace it with the real company page URL when available. GitHub is set to `https://github.com/omkarsoftwarestudio`.
- [ ] **Company identity** — official logo is `assets/images/logo.jpeg`; generated mark and favicons live in `assets/`.
- [ ] **Team** — the six profiles on `about.html` use real names, roles and role-based bios; add photos if desired.
- [ ] **Legal text** — have `privacy.html` and `terms.html` reviewed and rewritten by a qualified legal professional; add effective dates, legal entity name and jurisdiction.
- [ ] **Domain** — replace `www.example.com` in every `<link rel="canonical">`, Open Graph `og:url`, `sitemap.xml` and `robots.txt`.
- [ ] **Form notifications** — Netlify Forms handles submissions; set the notification recipient in the Netlify dashboard for the `contact` form.
- [ ] **SEO** — review every page title and meta description, and add an Open Graph image if you want rich link previews.
- [ ] **Analytics / cookies** — update the privacy policy if you add analytics or tracking cookies.

## Deploying for free

**GitHub Pages**

1. Create a GitHub repository and push this folder to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. Your site will be available at `https://<username>.github.io/<repository>/`. If you use a custom domain, update the canonical and sitemap URLs.

**Netlify**

1. Sign up at Netlify and choose **Add new site → Deploy manually**.
2. Drag and drop this folder onto the upload area.
3. Optionally set a custom domain in **Site settings → Domain management** and update the canonical / sitemap URLs.

**Vercel**

1. Import the GitHub repository into Vercel.
2. Framework preset: **Other**. Build command: leave empty. Output directory: `.` (the repository root).
3. Deploy, then add a custom domain if needed and update the canonical / sitemap URLs.

## Design system

- **Primary:** deep navy `#1B2A4A`
- **Accent:** orange `#F58220`, dark orange `#D9560B`, highlight `#F7931E` to `#E8600F`
- **Neutrals:** light `#F5F8FA`, white `#FFFFFF`, grey `#5B6577`
- **Fonts:** Plus Jakarta Sans (headings) and Inter (body), loaded from Google Fonts with `font-display: swap`
- All colours, spacing, radii, shadows and transitions are CSS variables in `:root` in `css/style.css`.
