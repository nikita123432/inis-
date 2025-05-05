const targets = document.querySelectorAll('.target');

let draggingElement = null;
let offsetX = 0;
let offsetY = 0;
let isStickyDragging = false;
let originalPosition = { x: 0, y: 0 };
let lastTapTime = 0;
let tapTimeoutId = null;
let stickyStartX = 0;
let stickyStartY = 0;
let stickyStartTime = 0;

function handleTouchMove(e) {
    if (!draggingElement) return;
    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    draggingElement.style.left = `${x}px`;
    draggingElement.style.top = `${y}px`;
}

function handleTouchEnd(e) {
    if (isStickyDragging) {
        const endTouch = e.changedTouches[0];
        const endX = endTouch.clientX;
        const endY = endTouch.clientY;
        const timeDiff = Date.now() - stickyStartTime;

        if (timeDiff < 300 && Math.abs(endX - stickyStartX) < 10 && Math.abs(endY - stickyStartY) < 10) {
            cancelDragging();
        }
    } else {
        draggingElement = null;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }
}

function cancelDragging() {
    if (draggingElement) {
        draggingElement.style.left = `${originalPosition.x}px`;
        draggingElement.style.top = `${originalPosition.y}px`;
        if (isStickyDragging) {
            draggingElement.style.backgroundColor = 'red';
            isStickyDragging = false;
        }
        draggingElement = null;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }
}

function handleMouseMove(e) {
    if (draggingElement) {
        draggingElement.style.left = `${e.clientX - offsetX}px`;
        draggingElement.style.top = `${e.clientY - offsetY}px`;
    }
}

function handleMouseUp() {
    if (draggingElement && !isStickyDragging) {
        draggingElement = null;
        document.removeEventListener('mousemove', handleMouseMove);
    }
}

targets.forEach(target => {
    // Обработчики для мыши
    target.addEventListener('mousedown', (e) => {
        if (isStickyDragging) return;
        draggingElement = target;
        originalPosition = {
            x: parseInt(target.style.left),
            y: parseInt(target.style.top)
        };
        offsetX = e.clientX - target.offsetLeft;
        offsetY = e.clientY - target.offsetTop;
        document.addEventListener('mousemove', handleMouseMove);
    });

    target.addEventListener('dblclick', (e) => {
        if (isStickyDragging) return;
        isStickyDragging = true;
        draggingElement = target;
        originalPosition = {
            x: parseInt(target.style.left),
            y: parseInt(target.style.top)
        };
        target.style.backgroundColor = 'green';
        offsetX = target.offsetWidth / 2;
        offsetY = target.offsetHeight / 2;
        document.addEventListener('mousemove', handleMouseMove);
    });

    // Обработчики для тач-событий
    target.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isStickyDragging) return;

        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTapTime;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            clearTimeout(tapTimeoutId);
            lastTapTime = 0;
            isStickyDragging = true;
            draggingElement = target;
            originalPosition = {
                x: parseInt(target.style.left),
                y: parseInt(target.style.top)
            };
            target.style.backgroundColor = 'green';
            const touch = e.touches[0];
            offsetX = touch.clientX - (target.offsetLeft + target.offsetWidth / 2);
            offsetY = touch.clientY - (target.offsetTop + target.offsetHeight / 2);
            stickyStartX = touch.clientX;
            stickyStartY = touch.clientY;
            stickyStartTime = currentTime;
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        } else {
            lastTapTime = currentTime;
            tapTimeoutId = setTimeout(() => {
                if (isStickyDragging) return;
                draggingElement = target;
                originalPosition = {
                    x: parseInt(target.style.left),
                    y: parseInt(target.style.top)
                };
                const touch = e.touches[0];
                offsetX = touch.clientX - target.offsetLeft;
                offsetY = touch.clientY - target.offsetTop;
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                document.addEventListener('touchend', handleTouchEnd);
            }, 300);
        }
    });
});

document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('click', () => {
    if (isStickyDragging) {
        cancelDragging();
    }
});

document.addEventListener('touchstart', (e) => {
    if (isStickyDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        offsetX = touch.clientX - (draggingElement.offsetLeft + draggingElement.offsetWidth / 2);
        offsetY = touch.clientY - (draggingElement.offsetTop + draggingElement.offsetHeight / 2);
        stickyStartX = touch.clientX;
        stickyStartY = touch.clientY;
        stickyStartTime = Date.now();
    } else if (draggingElement && e.touches.length > 1) {
        cancelDragging();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && draggingElement) {
        cancelDragging();
    }
});