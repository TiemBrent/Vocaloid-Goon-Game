// Common functions for storage and coin handling
function getCoins() {
    return parseInt(localStorage.getItem('mikoins') || '0');
}
function addCoins(n) {
    const current = getCoins();
    localStorage.setItem('mikoins', current + n);
    updateCoinDisplay();
}
function spendCoins(n) {
    const current = getCoins();
    if (current >= n) {
        localStorage.setItem('mikoins', current - n);
        updateCoinDisplay();
        return true;
    }
    alert('Not enough Hatsune Mikoins!');
    return false;
}
function updateCoinDisplay() {
    const el = document.getElementById('currency');
    if (el) el.textContent = `Hatsune Mikoins: ${getCoins()}`;
}
window.onload = updateCoinDisplay;

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function getDiscovered() {
    return JSON.parse(localStorage.getItem('discovered') || '[]');
}

function showFullscreen(imgSrc) {
    // Remove any existing overlay
    const old = document.getElementById('fullscreenOverlay');
    if (old) old.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.id = 'fullscreenOverlay';

    // Create image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'fullscreen-img';

    // Close on overlay click (not image)
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };

    overlay.appendChild(img);
    document.body.appendChild(overlay);
}
window.showFullscreen = showFullscreen;

function reset() {
    localStorage.setItem('discovered', JSON.stringify([]));
    localStorage.setItem('mikoins', '0');
    updateCoinDisplay();
    if (typeof updateDiscoveredViewer === 'function') updateDiscoveredViewer();
}
window.reset = reset;