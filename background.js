let extensionEnabled = false; // Default state is now false (disabled)

// Listen for icon clicks to toggle the extension state
chrome.action.onClicked.addListener((tab) => {
    extensionEnabled = !extensionEnabled; // Toggle state

    // Send a message to the content script with the new state
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {enabled: extensionEnabled});
    });

    // Optionally, change the icon to reflect the state
    let iconPath = extensionEnabled ? 'images/icon16.png' : 'images/icon_disabled16.png';
    chrome.action.setIcon({path: iconPath, tabId: tab.id});
});

// Initialize the icon to reflect the disabled state on startup
chrome.runtime.onInstalled.addListener(() => {
    let iconPath = 'images/icon_disabled16.png'; // Path to your disabled icon
    chrome.action.setIcon({path: iconPath});
});
