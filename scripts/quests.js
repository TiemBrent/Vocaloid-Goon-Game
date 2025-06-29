window.forceNewQuestNextRender = false;

// Daily Quests logic
document.addEventListener('DOMContentLoaded', function() {
  const questMenuIcon = document.getElementById('questMenuIcon');
  const questMenu = document.getElementById('questMenu');
  const questMenuOverlay = document.getElementById('questMenuOverlay');
  const questMenuClose = document.getElementById('questMenuClose');
  const questList = document.getElementById('questList');

  // --- Daily Quest Refresh System ---

  // Returns a string like "2025-6-30"
  function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  // Generate a new quest object
  function generateRollsQuest() {
    const rollsForQuest = 100 * (Math.floor(Math.random() * 10) + 1);
    return {
      type: 'rolls',
      rollsForQuest,
      completed: false,
      reward: rollsForQuest * 20
    };
  }

  // Get or create today's quest
  function getDailyQuest(forceNew = false) {
    const key = 'dailyQuest_' + getTodayKey();
    let quest = JSON.parse(localStorage.getItem(key) || 'null');
    if (!quest || forceNew) {
      quest = generateRollsQuest();
      localStorage.setItem(key, JSON.stringify(quest));
    }
    return quest;
  }

  // Mark today's quest as completed
  function setQuestCompleted() {
    const key = 'dailyQuest_' + getTodayKey();
    let quest = getDailyQuest();
    quest.completed = true;
    localStorage.setItem(key, JSON.stringify(quest));
  }

  // UI rendering (unchanged)
  function renderQuests(forceNew = false) {
    const quest = getDailyQuest(forceNew);
    questList.innerHTML = '';
    if (!quest.completed) {
      const li = document.createElement('li');
      li.style.marginBottom = '12px';
      const rolls = parseInt(localStorage.getItem('randomRolls') || '0');
      const progress = Math.min(rolls, quest.rollsForQuest);
      li.innerHTML = `
        <strong>Roll ${quest.rollsForQuest} times</strong><br>
        Progress: ${progress} / ${quest.rollsForQuest}
        <br>
        Reward: <span style="color:#39c5bb;font-weight:bold;">${quest.reward} Mi-Coins</span>
        <br>
        <button id="claimQuestBtn" ${quest.completed || rolls < quest.rollsForQuest ? 'disabled' : ''}>
          Claim Reward
        </button>
      `;
      questList.appendChild(li);
      setTimeout(() => {
        const btn = document.getElementById('claimQuestBtn');
        if (btn && !quest.completed && rolls >= quest.rollsForQuest) {
          btn.disabled = false;
          btn.onclick = function() {
            addCoins(quest.reward);
            setQuestCompleted();
            renderQuests();
          };
        }
      }, 0);
    }
  }

  // --- Midnight Refresh Logic ---

  window.lastQuestDay = getTodayKey(); // Use window property everywhere

  function checkForNewDay() {
    const todayKey = getTodayKey();
    if (todayKey !== window.lastQuestDay) {
      // New day detected: generate a new quest and update UI
      getDailyQuest(true);
      renderQuests(true);
      window.lastQuestDay = todayKey;
    }
  }

  // Check every minute for a new day
  setInterval(checkForNewDay, 60 * 1000);

  // Expose for manual testing
  window.getTodayKey = getTodayKey;
  window.getDailyQuest = getDailyQuest;
  window.setQuestCompleted = setQuestCompleted;
  window.renderQuests = renderQuests;
  window.checkForNewDay = checkForNewDay;

  function showQuestMenu() {
    // Hide stats menu if open
    const statsMenu = document.getElementById('statsMenu');
    const statsMenuOverlay = document.getElementById('statsMenuOverlay');
    if (statsMenu) statsMenu.style.display = 'none';
    if (statsMenuOverlay) statsMenuOverlay.style.display = 'none';

    questMenu.style.display = 'block';
    questMenuOverlay.style.display = 'block';
    console.log('[QUESTS] Quest menu shown');
    renderQuests();
  }
  function hideQuestMenu() {
    questMenu.style.display = 'none';
    questMenuOverlay.style.display = 'none';
    console.log('[QUESTS] Quest menu hidden');
  }
  if (questMenuIcon) questMenuIcon.onclick = showQuestMenu;
  if (questMenuOverlay) questMenuOverlay.onclick = hideQuestMenu;
  if (questMenuClose) questMenuClose.onclick = hideQuestMenu;
});