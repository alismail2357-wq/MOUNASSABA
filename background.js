chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (window.showGammaPanel) {
        window.showGammaPanel();
      } else {
        alert("⚠️ Gamma panel not loaded on this page!");
      }
    }
  });
});
