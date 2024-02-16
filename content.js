// Create tooltip element and apply class for styling
const tooltip = document.createElement('div');
tooltip.className = 'font-inspector-tooltip';
document.body.appendChild(tooltip);

function hasTextContent(element) {
    return element.nodeType === Node.TEXT_NODE && element.nodeValue.trim() !== '';
}

function getFontProperties(element) {
    if (!(element instanceof Element)) {
        console.error('getFontProperties was called with an invalid element:', element);
        return {}; // Return an empty object or some default value to avoid further errors
    }

    const style = window.getComputedStyle(element);
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const fontSizePx = style.fontSize;
    const fontSizeRem = (parseFloat(fontSizePx) / rootFontSize).toFixed(2) + 'rem';

    // Handling letterSpacing
    let letterSpacing = style.letterSpacing;
    // Only convert to rem if it's a specific pixel value
    if (letterSpacing !== 'normal') {
        const letterSpacingPx = parseFloat(letterSpacing);
        // Convert to 'rem' only if it's not '0px' to avoid division by zero
        const letterSpacingRem = letterSpacingPx !== 0 ? (letterSpacingPx / rootFontSize).toFixed(2) + 'rem' : '0px';
        letterSpacing = `${letterSpacing} (${letterSpacingRem})`;
    }

    return {
        fontFamily: style.fontFamily.split(',')[0].trim(),
        fontWeight: style.fontWeight === '400' ? 'Regular' : style.fontWeight,
        fontSize: `${fontSizePx} (${fontSizeRem})`,
        lineHeight: style.lineHeight,
        letterSpacing: letterSpacing !== 'normal' ? letterSpacing : 'default',
        color: style.color
    };
}


function rgbToHex(rgb) {
    // Check if the color is already in Hex format, return it directly
    if (rgb.indexOf('#') === 0) return rgb.toUpperCase();

    // Convert RGB(A) color to HEX
    let rgbArray = rgb.match(/\d+/g);
    let hex = rgbArray ? "#" + rgbArray.slice(0, 3).map(function(num) {
        return ("0" + parseInt(num).toString(16)).slice(-2);
    }).join('').toUpperCase() : rgb;

    return hex;
}



function showTooltip(fontData, x, y) {
    const colorHex = rgbToHex(fontData.color); // Convert color to Hex format
    tooltip.innerHTML = `
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00MC00MHYtMjQwaDgwdi00MDBINDB2LTI0MGgyNDB2ODBoNDAwdi04MGgyNDB2MjQwaC04MHY0MDBoODB2MjQwSDY4MHYtODBIMjgwdjgwSDQwWm0yNDAtMTYwaDQwMHYtODBoODB2LTQwMGgtODB2LTgwSDI4MHY4MGgtODB2NDAwaDgwdjgwWm0zMi0xMjAgMTM2LTM2MGg2NGwxMzYgMzYwaC02MmwtMzItOTJINDA4bC0zMiA5MmgtNjRabTExNC0xNDRoMTA4bC01Mi0xNTBoLTRsLTUyIDE1MFpNMTIwLTc2MGg4MHYtODBoLTgwdjgwWm02NDAgMGg4MHYtODBoLTgwdjgwWm0wIDY0MGg4MHYtODBoLTgwdjgwWm0tNjQwIDBoODB2LTgwaC04MHY4MFptODAtNjQwWm01NjAgMFptMCA1NjBabS01NjAgMFoiLz48L3N2Zz4=">Font: ${fontData.fontFamily}<span>${fontData.fontWeight}</span></div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik01NjAtMTYwdi01MjBIMzYwdi0xMjBoNTIwdjEyMEg2ODB2NTIwSDU2MFptLTM2MCAwdi0zMjBIODB2LTEyMGgzNjB2MTIwSDMyMHYzMjBIMjAwWiIvPjwvc3ZnPg==">Size: ${fontData.fontSize}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0yNDAtMTYwIDgwLTMyMGw1Ni01NiA2NCA2MnYtMzMybC02NCA2Mi01Ni01NiAxNjAtMTYwIDE2MCAxNjAtNTYgNTYtNjQtNjJ2MzMybDY0LTYyIDU2IDU2LTE2MCAxNjBabTI0MC00MHYtODBoNDAwdjgwSDQ4MFptMC0yNDB2LTgwaDQwMHY4MEg0ODBabTAtMjQwdi04MGg0MDB2ODBINDgwWiIvPjwvc3ZnPg==">Line Height: ${fontData.lineHeight}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0xNjAtMTYwdi02NDBoODB2NjQwaC04MFptNTYwIDB2LTY0MGg4MHY2NDBoLTgwWk0yOTQtMjgwbDE1MC00MDBoNzJsMTUwIDQwMGgtNjlsLTM2LTEwMkgzOTlsLTM2IDEwMmgtNjlabTEyNi0xNjBoMTIwbC01OC0xNjZoLTRsLTU4IDE2NloiLz48L3N2Zz4=">Spacing: ${fontData.letterSpacing}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00ODAtODBxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMyLjUtMTU2dDg4LTEyN1EyNTYtODE3IDMzMC04NDguNVQ0ODgtODgwcTgwIDAgMTUxIDI3LjV0MTI0LjUgNzZxNTMuNSA0OC41IDg1IDExNVQ4ODAtNTE4cTAgMTE1LTcwIDE3Ni41VDY0MC0yODBoLTc0cS05IDAtMTIuNSA1dC0zLjUgMTFxMCAxMiAxNSAzNC41dDE1IDUxLjVxMCA1MC0yNy41IDc0VDQ4MC04MFptMC00MDBabS0yMjAgNDBxMjYgMCA0My0xN3QxNy00M3EwLTI2LTE3LTQzdC00My0xN3EtMjYgMC00MyAxN3QtMTcgNDNxMCAyNiAxNyA0M3Q0MyAxN1ptMTIwLTE2MHEyNiAwIDQzLTE3dDE3LTQzcTAtMjYtMTctNDN0LTQzLTE3cS0yNiAwLTQzIDE3dC0xNyA0M3EwIDI2IDE3IDQzdDQzIDE3Wm0yMDAgMHEyNiAwIDQzLTE3dDE3LTQzcTAtMjYtMTctNDN0LTQzLTE3cS0yNiAwLTQzIDE3dC0xNyA0M3EwIDI2IDE3IDQzdDQzIDE3Wm0xMjAgMTYwcTI2IDAgNDMtMTd0MTctNDNxMC0yNi0xNy00M3QtNDMtMTdxLTI2IDAtNDMgMTd0LTE3IDQzcTAgMjYgMTcgNDN0NDMgMTdaTTQ4MC0xNjBxOSAwIDE0LjUtNXQ1LjUtMTNxMC0xNC0xNS0zM3QtMTUtNTdxMC00MiAyOS02N3Q3MS0yNWg3MHE2NiAwIDExMy0zOC41VDgwMC01MThxMC0xMjEtOTIuNS0yMDEuNVQ0ODgtODAwcS0xMzYgMC0yMzIgOTN0LTk2IDIyN3EwIDEzMyA5My41IDIyNi41VDQ4MC0xNjBaIi8+PC9zdmc+">Color: <span id="colorHex" style="cursor: pointer;" title="Click to copy">${colorHex}</span><span class="keyboard-shortcut style">⌘+C to copy</span>
        </div>
    `;
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    tooltip.style.display = 'block';
    tooltip.setAttribute('tabindex', '-1'); // Make it focusable without affecting tab order
    tooltip.focus();
}



function hideTooltip() {
    tooltip.style.display = 'none';
}
document.addEventListener('copy', function(event) {
    // Check if the copy event occurred within your tooltip
    if (event.target.closest('.font-inspector-tooltip')) {
        // Identify the element that contains the copy instructions
        let copyInstructionElem = document.querySelector('.font-inspector-tooltip .keyboard-shortcut.style');
        if (copyInstructionElem) {
            let originalText = copyInstructionElem.textContent; // Save the original text
            copyInstructionElem.textContent = 'Copied!'; // Change the text to show feedback

            // Change the text back to the original after 2 seconds
            setTimeout(() => {
                copyInstructionElem.textContent = originalText;
            }, 2000);
        }
    }
});

tooltip.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
        const colorHex = document.getElementById('colorHex').textContent;
        copyTextToClipboard(colorHex).then(() => {
            console.log('Color hex copied to clipboard');
            // Provide visual feedback that the color was copied, e.g., briefly changing the tooltip background color or showing a message
            tooltip.style.backgroundColor = "#e0e0e0"; // Temporary feedback
            setTimeout(() => tooltip.style.backgroundColor = "", 500); // Revert after 0.5 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
});


// Function to copy text to clipboard
function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Color hex copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Event listener to handle copy on click
document.addEventListener('click', (event) => {
    if (event.target.id === 'colorHex') {
        copyTextToClipboard(event.target.textContent);
        // Optional: Provide feedback to the user that the text was copied
        event.target.title = "Copied!";
        setTimeout(() => event.target.title = "Click to copy", 2000); // Reset title after 2 seconds
    }
});


let currentHoveredElement = null; // To keep track of the currently hovered element

// Function to apply underline style to the hovered element
function applyUnderlineToElement(element) {
    if(element) {
        element.style.textDecoration = 'underline';
        currentHoveredElement = element; // Store the current element to remove the underline later
    }
}

// Function to remove underline style from the element
function removeUnderlineFromElement() {
    if(currentHoveredElement) {
        currentHoveredElement.style.textDecoration = ''; // Remove the underline style
        currentHoveredElement = null; // Reset the current element
    }
}


document.addEventListener('mouseover', (event) => {
    if (!isExtensionEnabled) return; // Stop functionality if disabled
    
    // Your existing mouseover logic...
    let target = event.target;
    let validTargetFound = false;

    // Check if Command (on Mac) or Control (on Windows) is pressed for nested text check
    const isCommandOrCtrlPressed = event.metaKey || event.ctrlKey;

    if (isCommandOrCtrlPressed) {
        // Perform a deeper check to find text nodes within nested structures
        if (target.childNodes.length && hasNestedText(target)) {
            validTargetFound = true;
        }
    } else {
        // Original check for direct text content or known text-containing elements
        if (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE && target.childNodes[0].nodeValue.trim() !== '') {
            validTargetFound = true;
        } else if (['SPAN', 'P', 'A', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'LABEL'].includes(target.tagName)) {
            validTargetFound = true;
        }
    }

    if (validTargetFound) {
        const fontData = getFontProperties(target);
        showTooltip(fontData, event.pageX, event.pageY);
        applyUnderlineToElement(target); // Apply underline to the hovered text element
    } else {
        hideTooltip();
        removeUnderlineFromElement();
    }
});



let isExtensionEnabled = false; // Default state is now false (disabled)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.hasOwnProperty('enabled')) {
        isExtensionEnabled = request.enabled;
        if (!isExtensionEnabled) {
            // Optional: Clear any visible tooltips or underlines
            hideTooltip();
            removeUnderlineFromElement();
        }
    }
});

document.addEventListener('mouseout', (event) => {
    if (!isExtensionEnabled) return; // Stop functionality if disabled
    
    // Your existing mouseout logic...
    hideTooltip();
    removeUnderlineFromElement();
});


// Function to recursively check for nested text nodes within an element
function hasNestedText(element) {
    if (element.nodeType === Node.TEXT_NODE && element.nodeValue.trim() !== '') return true;
    for (let child of element.childNodes) {
        if (hasNestedText(child)) return true;
    }
    return false;
}
document.addEventListener('copy', function(event) {
    // Assuming the tooltip is visible and contains the content you're copying
    let copyInstructionElem = document.querySelector('.font-inspector-tooltip .keyboard-shortcut.style');
    if (copyInstructionElem) {
        let originalText = copyInstructionElem.textContent; // Save the original text
        copyInstructionElem.textContent = 'Copied!'; // Change the text to show feedback

        // Change the text back to the original after 2 seconds
        setTimeout(() => {
            copyInstructionElem.textContent = originalText;
        }, 2000);
    }
});
