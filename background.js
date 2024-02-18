let extensionEnabled = false;

chrome.action.onClicked.addListener((tab) => {
    extensionEnabled = !extensionEnabled;
    chrome.storage.local.set({ extensionEnabled: extensionEnabled });

    let iconPath = extensionEnabled ? 'images/icon16.png' : 'images/icon_disabled16.png';
    chrome.action.setIcon({ path: iconPath, tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(() => {
    let iconPath = 'images/icon_disabled16.png';
    chrome.action.setIcon({ path: iconPath });
});
