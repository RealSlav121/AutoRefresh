chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["inject.js"]
  }).catch(err => console.error(err));
});
