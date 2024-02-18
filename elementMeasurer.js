console.log('Content script loaded');

let persistedElement = null;

chrome.storage.local.get('isExtensionEnabled', function(data) {
    isExtensionEnabled = data.extensionEnabled || false;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { newValue }] of Object.entries(changes)) {
        if (key === 'extensionEnabled') {
            isExtensionEnabled = newValue;
            if (!isExtensionEnabled) {
                removeExistingOverlays(true);
                persistedElement = null;
            }
        }
    }
});

document.addEventListener('click', function (event) {
    if (!isExtensionEnabled) return;
    const targetElement = event.target;
    if (targetElement && targetElement !== document.body && targetElement !== document.documentElement && targetElement !== persistedElement) {
        if (persistedElement) {
            removeExistingOverlays(true);
        }
        persistedElement = targetElement;
        showOverlayWithDimensions(persistedElement);
    } else if (targetElement === persistedElement) {
        removeExistingOverlays(true);
        persistedElement = null;
    }
});

document.addEventListener('mouseover', function (event) {
    if (!isExtensionEnabled) return;
    const targetElement = event.target;
    if (targetElement && targetElement !== document.body && targetElement !== document.documentElement) {
        showOverlayWithDimensions(targetElement);
    }
});

function showOverlayWithDimensions(element) {
    if (persistedElement && element !== persistedElement) {
        return;
    }
    removeExistingOverlays();
    const rect = element.getBoundingClientRect();
    createMeasurementLine(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, true, true);
    createMeasurementLine(rect.left + window.scrollX, rect.top + window.scrollY, rect.height, false, true);
    createMeasurementLine(rect.left + window.scrollX, rect.bottom + window.scrollY, rect.width, true, false);
    createMeasurementLine(rect.right + window.scrollX, rect.top + window.scrollY, rect.height, false, false);
}

function createMeasurementLine(x, y, length, isHorizontal, addText) {
    const line = document.createElement('div');
    line.className = 'measurement-line';
    line.style.position = 'fixed';
    line.style.backgroundColor = 'transparent';
    line.style.zIndex = '10000';
    line.style.pointerEvents = 'none';
    line.style.border = isHorizontal ? `1px dashed red` : `1px dashed red`;
    line.style.width = isHorizontal ? `${length}px` : '0';
    line.style.height = isHorizontal ? '0' : `${length}px`;
    line.style.left = `${x}px`;
    line.style.top = `${y}px`;

    if (addText) {
        const text = document.createElement('div');
        text.textContent = `${length.toFixed(0)}px`;
        text.style.position = 'absolute';
        text.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        text.style.color = 'white';
        text.style.fontSize = '10px';
        text.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
        text.style.padding = '1px 4px';
        text.style.borderRadius = '4px';
        text.style.letterSpacing = '0.05em';
        if (isHorizontal) {
            text.style.top = '-20px';
            text.style.left = `${length / 2}px`;
            text.style.transform = 'translateX(-50%)';
        } else {
            text.style.top = `${length / 2}px`;
            text.style.left = '-50px';
            text.style.transform = 'translateY(-50%) rotate(-90deg)';
        }
        line.appendChild(text);
    }
    document.body.appendChild(line);
}

function removeExistingOverlays(forceRemove = false) {
    if (forceRemove || !persistedElement) {
        const existingOverlays = document.querySelectorAll('.measurement-line');
        existingOverlays.forEach(overlay => overlay.remove());
    }
}

document.addEventListener('mouseout', function (event) {
    if (!isExtensionEnabled) return;
    removeExistingOverlays();
});
