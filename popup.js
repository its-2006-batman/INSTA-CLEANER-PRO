const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const status = document.getElementById("status");

function sendToActiveTab(message, onSuccessText) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.id) {
      status.innerText = "No active tab";
      return;
    }

    chrome.tabs.sendMessage(tab.id, message, () => {
      if (chrome.runtime.lastError) {
        status.innerText = "Open instagram.com first";
        return;
      }
      status.innerText = onSuccessText;
    });
  });
}

startBtn.onclick = async () => {
  const limitValue = parseInt(document.getElementById("limit").value, 10);
  const delayValue = parseInt(document.getElementById("delay").value, 10);
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : 30;
  const delay = Number.isFinite(delayValue) ? Math.max(300, delayValue) : 1000;

  // Save settings
  chrome.storage.local.set({ limit, delay });

  sendToActiveTab({
    type: "START",
    limit: limit,
    delay: delay
  }, "Running...");
};

stopBtn.onclick = async () => {
  sendToActiveTab({
    type: "STOP"
  }, "Stopped");
};