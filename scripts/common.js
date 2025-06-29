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
    alert('Not enough Mi-Coins!');
    return false;
}
function updateCoinDisplay() {
    const el = document.getElementById('currency');
    if (el) el.textContent = `Mi-Coins: ${getCoins()}`;
}
window.onload = updateCoinDisplay;

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function getDiscovered() {
    return JSON.parse(localStorage.getItem('discovered') || '[]');
}

/**
 * Enhanced fullscreen with navigation.
 * @param {string} imgSrc - The image to show.
 * @param {Array<string>} imgList - The list of images (filenames, e.g. goon1.jpg).
 * @param {number} imgIndex - The index of the current image in imgList.
 */
function showFullscreen(imgSrc, imgList, imgIndex) {
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
    img.style.display = 'block';
    img.style.position = 'relative';
    img.style.zIndex = '2';

    // Navigation logic (not on random.html)
    if (!window.location.pathname.endsWith('random.html') && Array.isArray(imgList) && typeof imgIndex === 'number') {
        // Create navigation layer
        const navLayer = document.createElement('div');
        navLayer.style.position = 'absolute';
        navLayer.style.top = '0';
        navLayer.style.left = '0';
        navLayer.style.width = '100%';
        navLayer.style.height = '100%';
        navLayer.style.display = 'flex';
        navLayer.style.zIndex = '3';

        // Left nav
        const leftNav = document.createElement('div');
        leftNav.style.flex = '1';
        leftNav.style.cursor = imgIndex > 0 ? 'pointer' : 'default';
        leftNav.style.background = 'transparent';
        leftNav.onclick = (e) => {
            e.stopPropagation();
            if (imgIndex > 0) {
                showFullscreen('images/' + imgList[imgIndex - 1], imgList, imgIndex - 1);
            }
        };

        // Right nav
        const rightNav = document.createElement('div');
        rightNav.style.flex = '1';
        rightNav.style.cursor = imgIndex < imgList.length - 1 ? 'pointer' : 'default';
        rightNav.style.background = 'transparent';
        rightNav.onclick = (e) => {
            e.stopPropagation();
            if (imgIndex < imgList.length - 1) {
                showFullscreen('images/' + imgList[imgIndex + 1], imgList, imgIndex + 1);
            }
        };

        navLayer.appendChild(leftNav);
        navLayer.appendChild(rightNav);

        // Container for positioning
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.appendChild(img);
        container.appendChild(navLayer);

        overlay.appendChild(container);
    } else {
        overlay.appendChild(img);
    }

    // Close on overlay click (not image)
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };

    document.body.appendChild(overlay);
}
window.showFullscreen = showFullscreen;

let questsReady = false;
document.addEventListener('DOMContentLoaded', () => { questsReady = true; });

let resetRetryCount = 0;
const MAX_RESET_RETRIES = 20;

function reset() {
  // Reset stats
  localStorage.setItem('clicks', '0');
  localStorage.setItem('randomRolls', '0');
  localStorage.setItem('discovered', '[]');
  localStorage.setItem('siteStart', Date.now().toString());
  localStorage.setItem('favorites', '[]');
  localStorage.setItem('totalPlaytime', '0');
  localStorage.setItem('mikoins', '0');
  sessionStorage.removeItem('sessionStart');

  // Remove all daily quests
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('dailyQuest_')) {
      localStorage.removeItem(key);
    }
  });

  // Generate a new quest for today and update UI
  if (window.getDailyQuest && window.renderQuests) {
    window.getDailyQuest(true);
    window.renderQuests(true);
  }

  if (typeof updateStatsMenu === "function") {
    updateStatsMenu();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.reset = reset; // expose for console
});

// Animate click.gif when clicked
document.addEventListener('DOMContentLoaded', function() {
  const clicker = document.getElementById('clicker');
  if (clicker) {
    clicker.addEventListener('click', () => {
      clicker.style.transition = 'transform 0.08s';
      clicker.style.transform = 'scale(0.99)';
      setTimeout(() => {
        clicker.style.transform = 'scale(1)';
      }, 80);
    });
  }
});