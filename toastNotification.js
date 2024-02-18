chrome.runtime.onMessage.addListener((message) => {
    if (message.hasOwnProperty('showNotification')) {
        if (message.showNotification) {
            showToastNotification();
        } else {
            hideToastNotification();
        }
    }
});

function showToastNotification() {
    const notification = document.createElement('div');
    notification.id = 'extension-toast-notification';
    notification.style.position = 'fixed';
    notification.style.top = '16px';
    notification.style.right = '16px';
    notification.style.backgroundColor = '#37352f';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '10000';
    notification.innerText = 'Extension is now active!';

    const closeBtn = document.createElement('span');
    closeBtn.innerText = '✖';
    closeBtn.style.marginLeft = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        hideToastNotification();
        chrome.runtime.sendMessage({ showNotification: false });
    };

    notification.appendChild(closeBtn);
    document.body.appendChild(notification);
}

function hideToastNotification() {
    const notification = document.getElementById('extension-toast-notification');
    if (notification) {
        notification.remove();
    }
}
