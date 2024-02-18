document.body.style.position = 'relative';
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '10000';
canvas.style.pointerEvents = 'none';

document.body.appendChild(canvas);

function drawRulers() {
    const rulerHeight = 30;
    ctx.clearRect(0, 0, canvas.width, rulerHeight);
    ctx.clearRect(0, 0, rulerHeight, canvas.height);

    ctx.fillStyle = 'rgba(31, 31, 31, 1)';
    ctx.fillRect(0, 0, canvas.width, rulerHeight);
    ctx.fillRect(0, 0, rulerHeight, canvas.height);

    ctx.font = '12px Helvetica';
    ctx.fillStyle = '#C0C0C0';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'start';

    for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rulerHeight);
        ctx.fillText(x, x + 5, 15);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rulerHeight, y);
        ctx.fillText(y, 5, y + 10);
        ctx.stroke();
    }
}

drawRulers();

let isDrawing = false;
let guidelines = [];

canvas.style.pointerEvents = 'auto';
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', drawGuide);

let startMousePos = null;

function startDrawing(e) {
    if (e.clientX > 30 && e.clientY > 30) return;
    const pos = getMousePosition(e);
    isDrawing = true;
    startMousePos = pos;
}

function stopDrawing(e) {
    if (!isDrawing || !startMousePos) return;

    const endPos = getMousePosition(e);

    let newGuideline;
    if (startMousePos.x <= 30) {
        newGuideline = { x: 30, y: endPos.y, isHorizontal: true };
    } else if (startMousePos.y <= 30) {
        newGuideline = { x: endPos.x, y: 30, isHorizontal: false };
    }

    if (newGuideline) {
        guidelines.push(newGuideline);
    }

    isDrawing = false;
    startMousePos = null;

    redrawCanvas();
}

function drawGuide(e) {
    if (!isDrawing || !startMousePos) return;

    const currentPos = getMousePosition(e);
    redrawCanvas();

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (startMousePos.x <= 30) {
        ctx.moveTo(30, currentPos.y);
        ctx.lineTo(canvas.width, currentPos.y);
    } else if (startMousePos.y <= 30) {
        ctx.moveTo(currentPos.x, 30);
        ctx.lineTo(currentPos.x, canvas.height);
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRulers();
    drawGuidelines();
}

function drawGuidelines() {
    guidelines.forEach(guide => {
        ctx.beginPath();
        ctx.strokeStyle = '#B3B3B3';
        ctx.lineWidth = 1;

        if (guide.isHorizontal) {
            ctx.moveTo(30, guide.y);
            ctx.lineTo(canvas.width, guide.y);
        } else {
            ctx.moveTo(guide.x, 30);
            ctx.lineTo(guide.x, canvas.height);
        }
        ctx.stroke();
    });
}

function getMousePosition(e) {
    return { x: e.clientX, y: e.clientY };
}