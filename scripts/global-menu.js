document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.getElementById('menuIcon');
  const statsMenu = document.getElementById('statsMenu');
  const statsMenuOverlay = document.getElementById('statsMenuOverlay');
  const statsMenuClose = document.getElementById('statsMenuClose');

  // Ensure all stats keys exist in localStorage
  if (!localStorage.getItem('clicks')) localStorage.setItem('clicks', '0');
  if (!localStorage.getItem('randomRolls')) localStorage.setItem('randomRolls', '0');
  if (!localStorage.getItem('discovered')) localStorage.setItem('discovered', '[]');
  if (!localStorage.getItem('siteStart')) localStorage.setItem('siteStart', Date.now());

  // --- Playtime tracking (only time spent with the page open) ---

  // On page load, record session start
  if (!sessionStorage.getItem('sessionStart')) {
    sessionStorage.setItem('sessionStart', Date.now());
  }

  // On page unload, add session time to total playtime
  window.addEventListener('beforeunload', function() {
    const sessionStart = parseInt(sessionStorage.getItem('sessionStart') || Date.now());
    const now = Date.now();
    const sessionSeconds = Math.floor((now - sessionStart) / 1000);
    const prevTotal = parseInt(localStorage.getItem('totalPlaytime') || '0');
    localStorage.setItem('totalPlaytime', prevTotal + sessionSeconds);
    sessionStorage.removeItem('sessionStart');
  });

  // In updateStatsMenu, use totalPlaytime + current session
  function updateStatsMenu() {
    // Debug: show images array status
    console.log('--- updateStatsMenu ---');
    console.log('typeof images:', typeof window.images);
    console.log('Array.isArray(images):', Array.isArray(window.images));
    if (Array.isArray(window.images)) {
      console.log('images.length:', window.images.length);
      console.log('First 5 images:', window.images.slice(0, 5));
    }

    // Click.gif clicks
    const statClicks = document.getElementById('statClicks');
    if (statClicks) statClicks.textContent = localStorage.getItem('clicks') || '0';
    // Random rolls
    const statRandoms = document.getElementById('statRandoms');
    if (statRandoms) statRandoms.textContent = localStorage.getItem('randomRolls') || '0';

    // Unlocked/locked/total images
    let total = 0;
    let unlocked = 0;
    let locked = 0;

    if (typeof window.images !== "undefined" && Array.isArray(window.images)) {
      total = images.length;
      const discovered = JSON.parse(localStorage.getItem('discovered') || '[]');
      console.log('discovered:', discovered);
      // Only count discovered images that are in the images array
      unlocked = images.filter(img => discovered.includes(img)).length;
      locked = total - unlocked;
      if (locked < 0) locked = 0;
      console.log('unlocked:', unlocked, 'locked:', locked, 'total:', total);
    } else {
      // If images not loaded yet, try again soon
      console.log('images not loaded yet, retrying...');
      setTimeout(updateStatsMenu, 100);
      return;
    }

    const statUnlocked = document.getElementById('statUnlocked');
    const statLocked = document.getElementById('statLocked');
    const statTotal = document.getElementById('statTotal');

    if (statUnlocked) statUnlocked.textContent = unlocked;
    if (statLocked) statLocked.textContent = locked;
    if (statTotal) statTotal.textContent = total;

    // Playtime calculation
    const prevTotal = parseInt(localStorage.getItem('totalPlaytime') || '0');
    const sessionStart = parseInt(sessionStorage.getItem('sessionStart') || Date.now());
    const now = Date.now();
    const sessionSeconds = Math.floor((now - sessionStart) / 1000);
    const totalSeconds = prevTotal + sessionSeconds;

    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor((totalSeconds % 86400) / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;
    const statTime = document.getElementById('statTime');
    if (statTime) statTime.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
  }

  // Show/hide menu logic (always enabled)
  function showStatsMenu() {
    // Hide quest menu if open
    const questMenu = document.getElementById('questMenu');
    const questMenuOverlay = document.getElementById('questMenuOverlay');
    if (questMenu) questMenu.style.display = 'none';
    if (questMenuOverlay) questMenuOverlay.style.display = 'none';

    statsMenu.style.display = 'block';
    statsMenuOverlay.style.display = 'block';
    updateStatsMenu();
  }
  function hideStatsMenu() {
    statsMenu.style.display = 'none';
    statsMenuOverlay.style.display = 'none';
  }
  if (menuIcon) menuIcon.onclick = showStatsMenu;
  if (statsMenuOverlay) statsMenuOverlay.onclick = hideStatsMenu;
  if (statsMenuClose) statsMenuClose.onclick = hideStatsMenu;

  // Always update stats every second while menu is open
  setInterval(() => {
    if (statsMenu && statsMenu.style.display === 'block') updateStatsMenu();
  }, 1000);

  // --- Track click.gif clicks and random rolls globally ---
  (function(){
    // For click.gif
    const clicker = document.getElementById('clicker');
    if (clicker) {
      clicker.addEventListener('click', () => {
        let clicks = parseInt(localStorage.getItem('clicks') || '0');
        localStorage.setItem('clicks', clicks + 1);
      });
    }
    // For random rolls
    const randomBtn = document.getElementById('showRandom');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        let rolls = parseInt(localStorage.getItem('randomRolls') || '0');
        localStorage.setItem('randomRolls', rolls + 1);
      });
    }
    // Ensure siteStart is set (redundant, but safe)
    if (!localStorage.getItem('siteStart')) {
      localStorage.setItem('siteStart', Date.now());
    }
  })();
});