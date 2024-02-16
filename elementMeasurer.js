document.addEventListener('mouseover', function(event) {
    const targetElement = event.target;
    if (targetElement && targetElement !== document.body && targetElement !== document.documentElement) {
        showOverlayWithDimensions(targetElement);
    }
});

function showOverlayWithDimensions(element) {
    removeExistingOverlays();

    const rect = element.getBoundingClientRect();

    // Measurement lines for top and left with dimension text
    createMeasurementLine(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, true, true);
    createMeasurementLine(rect.left + window.scrollX, rect.top + window.scrollY, rect.height, false, true);

    // Measurement lines for bottom and right without dimension text
    createMeasurementLine(rect.left + window.scrollX, rect.bottom + window.scrollY, rect.width, true, false);
    createMeasurementLine(rect.right + window.scrollX, rect.top + window.scrollY, rect.height, false, false);

    // Decorative corner circles
    createCornerDecorations(rect);
}

function createMeasurementLine(x, y, length, isHorizontal, addText) {
    const line = document.createElement('div');
    line.className = 'measurement-line';
    line.style.position = 'fixed';
    line.style.backgroundColor = 'transparent';
    line.style.zIndex = '10000';
    line.style.pointerEvents = 'none';

    // Dashed lines
    line.style.border = isHorizontal ? `1px dashed red` : `1px dashed red`;
    line.style.width = isHorizontal ? `${length}px` : '0';
    line.style.height = isHorizontal ? '0' : `${length}px`;

    // Position adjustments
    line.style.left = `${x}px`;
    line.style.top = `${y}px`;

    if (addText) {
        // Text for dimensions, shown only on top and left lines
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

        // Center text on the line
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

function removeExistingOverlays() {
    const existingOverlays = document.querySelectorAll('.measurement-line, .measurement-corner-circle');
    existingOverlays.forEach(overlay => overlay.remove());
}

document.addEventListener('mouseout', function(event) {
    removeExistingOverlays();
});
