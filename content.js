let running = false;
let loopPromise = null;
const processedHrefs = new Set();

console.log("✅ Content script loaded on Instagram");

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "START") {
    const limitValue = parseInt(request.limit, 10);
    const delayValue = parseInt(request.delay, 10);
    const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : 30;
    const delay = Number.isFinite(delayValue) ? Math.max(300, delayValue) : 1000;

    if (running) {
      console.log("ℹ️ Already running");
      return;
    }

    running = true;
    processedHrefs.clear();
    console.log(`🚀 Starting unsave bot (limit=${limit}, delay=${delay}ms)`);
    loopPromise = unsaveLoop(limit, delay);
    return;
  }

  if (request.type === "STOP") {
    running = false;
    console.log("🛑 Stopped by user");
  }
});

async function unsaveLoop(limit, delay) {
  let count = 0;

  while (running && count < limit) {
    try {
      await scrollFeed();

      const targetLink = getNextSavedItemLink();
      if (!targetLink) {
        console.log("⚠️ No new saved items found on screen");
        break;
      }

      const href = targetLink.href;
      processedHrefs.add(href);

      targetLink.click();
      await sleep(1200);

      const removeToggle = findSavedToggleButton();
      if (!removeToggle) {
        console.log("⚠️ Remove toggle not found in viewer");
        closeViewer();
        await sleep(600);
        continue;
      }

      clickElement(removeToggle);
      await sleep(900);

      const confirmButton = findConfirmRemoveButton();
      if (confirmButton) {
        clickElement(confirmButton);
        await sleep(1200);
      }

      const stillSaved = hasSavedToggleVisible();
      if (stillSaved) {
        console.log("⚠️ Not removed yet, skipping count for this item");
      } else {
        count += 1;
        console.log(`✅ Unsaved: ${count}/${limit}`);
      }

      closeViewer();
      await sleep(delay);
    } catch (error) {
      console.log("❌ Error:", error);
      break;
    }
  }

  running = false;
  console.log(`✅ Finished. Total unsaved: ${count}`);
}

function getNextSavedItemLink() {
  const links = document.querySelectorAll("article a[href*='/reel/'], article a[href*='/p/']");
  for (const link of links) {
    if (!link.href) {
      continue;
    }
    if (processedHrefs.has(link.href)) {
      continue;
    }
    return link;
  }
  return null;
}

function findSavedToggleButton() {
  const exactIcon = document.querySelector("svg[aria-label='Remove']");
  if (exactIcon) {
    return exactIcon.closest("button, [role='button']");
  }

  const fallbackIcon = document.querySelector("svg[aria-label='Unsave'], svg[aria-label='Saved']");
  if (fallbackIcon) {
    return fallbackIcon.closest("button, [role='button']");
  }

  return null;
}

function hasSavedToggleVisible() {
  return Boolean(document.querySelector("svg[aria-label='Remove'], svg[aria-label='Unsave'], svg[aria-label='Saved']"));
}

function findConfirmRemoveButton() {
  const headings = Array.from(document.querySelectorAll("h3"));
  const dialogHeading = headings.find((h) => /remove from saved/i.test((h.textContent || "").trim()));

  if (dialogHeading) {
    const dialogRoot = dialogHeading.closest("div[role='dialog']") || dialogHeading.closest("div");
    if (dialogRoot) {
      const candidates = dialogRoot.querySelectorAll("button, [role='button']");
      for (const candidate of candidates) {
        if ((candidate.textContent || "").trim() === "Remove") {
          return candidate;
        }
      }
    }
  }

  const exactButtons = Array.from(document.querySelectorAll("button, [role='button']")).filter(
    (button) => (button.textContent || "").trim() === "Remove"
  );

  return exactButtons.length === 1 ? exactButtons[0] : null;
}

function clickElement(element) {
  if (!element) {
    return;
  }
  element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
}

function closeViewer() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}

async function scrollFeed() {
  window.scrollBy(0, 700);
  await sleep(350);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
