# OWL Webpage

**OWL Webpage** is a modern landing and promo site for the OWL application, built with React, featuring smooth animations, modular architecture, and unified styling.

---

## Quick Start

```bash
git clone https://github.com/Nighty3098/owl_website
cd owl_website
yarn
yarn start
```

---

## Tech Stack

- **React 19**
- **React Router v7** — routing
- **Framer Motion** — animations
- **FontAwesome** — icons
- **Prettier** — code formatting
- **Vercel Analytics** — analytics
- **Custom CSS utilities** — for unified styling

---

## Project Structure

```
src/
  components/
    layout/      # Header, Footer
    pages/       # Standalone pages (Privacy, Terms, Download)
    sections/    # Main landing sections (HeroSection.jsx, FeaturesSection.jsx, ImagesSection.jsx, Dock.jsx, RText.jsx, Contacts.jsx, DownloadSection.jsx, WIOF/ etc.)
    ui/          # Reusable UI components (e.g., OwlIcon)
  data/          # Static data (e.g., images)
  hooks/         # Custom hooks (e.g., useTheme)
  styles/        # Main styles, animations, motionConfig.js
  App.js         # Main application component
  index.js       # Entry point
```

---

## Component Organization (One Component — One File)

Each React component now lives in its own file for clarity and maintainability. For example:

- `Dock.jsx` — animated icon dock (was part of SloganSection)
- `RText.jsx` — rotated animated text (was part of SloganSection)
- `FeaturesSection.jsx` — features grid (was Features)
- `ImagesSection.jsx` — image slider (was Images)
- `HeroSection.jsx` — main hero block

This modular approach makes it easier to:
- Find and edit components
- Reuse and test components
- Scale the project

---

## Main Components & Pages

- **HeroSection** — main screen with logo and slogan
- **Dock** — animated block with icons
- **RText** — animated/rotated text
- **FeaturesSection** — app features (icons + text)
- **ImagesSection** — slider with interface screenshots
- **DownloadSection** — call to action and download button
- **Contacts** — social media and contacts
- **WIOF** — target audience (cards)
- **DownloadPage** — download page with form
- **PrivacyPage** — privacy policy
- **TermsPage** — terms of service

---

## Animations

- All animations are implemented with **Framer Motion**
- Unified animation parameters are used (see `src/styles/motionConfig.js`)
- For element appearance — smooth fade/slide with duration 0.6s, ease `[0.4, 0, 0.2, 1]`
- For lists — delay between items via the `MOTION_LIST(index)` function

---

## Styling

- All styles are centralized in `src/styles/index.css`
- CSS variables are used for colors, border-radius, sizes
- Utility CSS classes for flex, gap, margin, padding, border-radius, font-size, etc.
- Logo animation — via separate `owl_animation.css`

---

## Custom Hooks

- **useTheme** — toggles light/dark theme and saves preference in localStorage

---

## Data

- **src/data/images.js** — array of images for the slider

---

## Scripts

- `yarn start` — run dev server
- `yarn build` — build production version
- `yarn test` — run tests
- `yarn format` — auto-format code

---

## Best Practices

- **One component — one file**: Each UI element or section is a separate file for clarity and reusability.
- **Clear naming**: File and component names reflect their purpose (e.g., `FeaturesSection.jsx`, `Dock.jsx`).
- **Centralized styles**: All global and utility styles are in `src/styles/index.css`.
- **Consistent animation**: All motion/animation configs are in `motionConfig.js`.
- **Explicit exports**: Use `export default` for main components to simplify imports.

---

## Contacts

- Telegram: [@Night3098](https://t.me/Night3098)
- Discord: [Nighty3098](https://discord.gg/#9707)
- Reddit: [DEVELOPER0x31](https://www.reddit.com/user/DEVELOPER0x31/)
- Signal: [link](https://signal.me/#eu/XJMqmO9JXZQCwYJIpzjOS741ZnGsLYOQhGqMfpS4lB-8PTSQVmRAbqFIvOrepYiK)

---

## License

MIT

---

**If you need to add a section (e.g., how to add a new section, extend styles, deploy, etc.) — let me know!**
