# Insta Cleaner Pro

Because manually unsaving 500 reels is character development you did **not** ask for.

When you’re too lazy to do it yourself and free options are basically nonexistent, this extension is your emotional support automation.

## What this does

- Start/Stop from a tiny popup (very slay)
- Set max unsave count so it doesn’t go feral
- Set delay between actions so Instagram doesn’t side-eye your account
- Runs directly on Instagram pages

## Project files

- `manifest.json` – extension config (Manifest V3)
- `popup.html` – popup layout
- `popup.js` – popup behavior + messaging
- `content.js` – page automation logic
- `styles.css` – popup styling

## Install (Chrome)

1. Open `chrome://extensions/`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select this folder

## How to use

1. Open `https://www.instagram.com/`
2. Open the extension popup
3. Set:
   - **Max Unsave**
   - **Delay (ms)**
4. Click **Start**
5. Click **Stop** whenever you want

## Real talk

- Don’t set delay to chaotic values unless you enjoy random failures.
- Instagram changes UI a lot, so selectors might break sometimes (we love that for us).

## Disclaimer

Use at your own risk. Automation may violate platform terms.
