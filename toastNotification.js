function createToastNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'extension-toast-notification';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '100000';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.justifyContent = 'space-between';
    toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    const text = document.createElement('span');
    text.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '15px';
    closeButton.style.fontSize = '16px';

    closeButton.addEventListener('click', () => {
        toast.remove();
        // Send a message to the background script to disable the extension
        chrome.runtime.sendMessage({ disableExtension: true });
    });

    toast.appendChild(text);
    toast.appendChild(closeButton);
    document.body.appendChild(toast);
}

// In toastNotification.js
setTimeout(() => {
    createToastNotification('Extension is enabled');
}, 1000); // Adjust the delay as needed

// Create the toast notification when the script is injected