// Create tooltip element and apply class for styling
const tooltip = document.createElement('div');
tooltip.className = 'font-inspector-tooltip';
document.body.appendChild(tooltip);

function hasTextContent(element) {
    return element.nodeType === Node.TEXT_NODE && element.nodeValue.trim() !== '';
}

function getFontProperties(element) {
    const style = window.getComputedStyle(element);
    return {
        fontFamily: style.fontFamily.split(',')[0],
        fontWeight: style.fontWeight === '400' ? 'Regular' : style.fontWeight,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        color: style.color
    };
}

function showTooltip(fontData, x, y) {
    tooltip.innerHTML = `
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00MC00MHYtMjQwaDgwdi00MDBINDB2LTI0MGgyNDB2ODBoNDAwdi04MGgyNDB2MjQwaC04MHY0MDBoODB2MjQwSDY4MHYtODBIMjgwdjgwSDQwWm0yNDAtMTYwaDQwMHYtODBoODB2LTQwMGgtODB2LTgwSDI4MHY4MGgtODB2NDAwaDgwdjgwWm0zMi0xMjAgMTM2LTM2MGg2NGwxMzYgMzYwaC02MmwtMzItOTJINDA4bC0zMiA5MmgtNjRabTExNC0xNDRoMTA4bC01Mi0xNTBoLTRsLTUyIDE1MFpNMTIwLTc2MGg4MHYtODBoLTgwdjgwWm02NDAgMGg4MHYtODBoLTgwdjgwWm0wIDY0MGg4MHYtODBoLTgwdjgwWm0tNjQwIDBoODB2LTgwaC04MHY4MFptODAtNjQwWm01NjAgMFptMCA1NjBabS01NjAgMFoiLz48L3N2Zz4=">Font: ${fontData.fontFamily}<span>${fontData.fontWeight}</span></div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik01NjAtMTYwdi01MjBIMzYwdi0xMjBoNTIwdjEyMEg2ODB2NTIwSDU2MFptLTM2MCAwdi0zMjBIODB2LTEyMGgzNjB2MTIwSDMyMHYzMjBIMjAwWiIvPjwvc3ZnPg==">Size: ${fontData.fontSize}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0yNDAtMTYwIDgwLTMyMGw1Ni01NiA2NCA2MnYtMzMybC02NCA2Mi01Ni01NiAxNjAtMTYwIDE2MCAxNjAtNTYgNTYtNjQtNjJ2MzMybDY0LTYyIDU2IDU2LTE2MCAxNjBabTI0MC00MHYtODBoNDAwdjgwSDQ4MFptMC0yNDB2LTgwaDQwMHY4MEg0ODBabTAtMjQwdi04MGg0MDB2ODBINDgwWiIvPjwvc3ZnPg==">Line Height: ${fontData.lineHeight}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0xNjAtMTYwdi02NDBoODB2NjQwaC04MFptNTYwIDB2LTY0MGg4MHY2NDBoLTgwWk0yOTQtMjgwbDE1MC00MDBoNzJsMTUwIDQwMGgtNjlsLTM2LTEwMkgzOTlsLTM2IDEwMmgtNjlabTEyNi0xNjBoMTIwbC01OC0xNjZoLTRsLTU4IDE2NloiLz48L3N2Zz4=">Spacing: ${fontData.letterSpacing}</div>
        <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00ODAtODBxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMyLjUtMTU2dDg4LTEyN1EyNTYtODE3IDMzMC04NDguNVQ0ODgtODgwcTgwIDAgMTUxIDI3LjV0MTI0LjUgNzZxNTMuNSA0OC41IDg1IDExNVQ4ODAtNTE4cTAgMTE1LTcwIDE3Ni41VDY0MC0yODBoLTc0cS05IDAtMTIuNSA1dC0zLjUgMTFxMCAxMiAxNSAzNC41dDE1IDUxLjVxMCA1MC0yNy41IDc0VDQ4MC04MFptMC00MDBabS0yMjAgNDBxMjYgMCA0My0xN3QxNy00M3EwLTI2LTE3LTQzdC00My0xN3EtMjYgMC00MyAxN3QtMTcgNDNxMCAyNiAxNyA0M3Q0MyAxN1ptMTIwLTE2MHEyNiAwIDQzLTE3dDE3LTQzcTAtMjYtMTctNDN0LTQzLTE3cS0yNiAwLTQzIDE3dC0xNyA0M3EwIDI2IDE3IDQzdDQzIDE3Wm0yMDAgMHEyNiAwIDQzLTE3dDE3LTQzcTAtMjYtMTctNDN0LTQzLTE3cS0yNiAwLTQzIDE3dC0xNyA0M3EwIDI2IDE3IDQzdDQzIDE3Wm0xMjAgMTYwcTI2IDAgNDMtMTd0MTctNDNxMC0yNi0xNy00M3QtNDMtMTdxLTI2IDAtNDMgMTd0LTE3IDQzcTAgMjYgMTcgNDN0NDMgMTdaTTQ4MC0xNjBxOSAwIDE0LjUtNXQ1LjUtMTNxMC0xNC0xNS0zM3QtMTUtNTdxMC00MiAyOS02N3Q3MS0yNWg3MHE2NiAwIDExMy0zOC41VDgwMC01MThxMC0xMjEtOTIuNS0yMDEuNVQ0ODgtODAwcS0xMzYgMC0yMzIgOTN0LTk2IDIyN3EwIDEzMyA5My41IDIyNi41VDQ4MC0xNjBaIi8+PC9zdmc+">Color: ${fontData.color}</div>
    `;
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    tooltip.style.display = 'block';
}



function hideTooltip() {
    tooltip.style.display = 'none';
}

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

// Add event listener for mouseover to show tooltip and underline text
document.addEventListener('mouseover', (event) => {
    let target = event.target;
    let validTargetFound = false;

    // Check if the target itself has text content directly
    if (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE && target.childNodes[0].nodeValue.trim() !== '') {
        validTargetFound = true;
    } 
    // Additional check for specific elements that are known to contain text directly
    else if (['SPAN', 'P', 'A', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'LABEL'].includes(target.tagName)) {
        validTargetFound = true;
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

document.addEventListener('mouseout', () => {
    hideTooltip();
    removeUnderlineFromElement();
});
