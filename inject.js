(() => {
  if (document.getElementById('ar-indicator')) return;

  const STORAGE_KEY = 'autoRefreshSettings';
  let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    interval: 5,
    enabled: false,
  };

  let refreshTimer = null;

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function updateIndicator() {
    const indicator = document.getElementById('ar-indicator');
    if (indicator) {
      indicator.style.backgroundColor = settings.enabled ? 'limegreen' : 'red';
      indicator.title = `Auto-refresh is ${settings.enabled ? 'ON' : 'OFF'}`;
    }
  }

  function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => location.reload(), settings.interval * 1000);
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  function createIndicator() {
    const style = document.createElement('style');
    style.textContent = `
      #ar-indicator {
        position: fixed;
        top: 12px;
        right: 12px;
        width: 12px;
        height: 12px;
        background-color: red;
        border-radius: 50%;
        z-index: 999999;
        box-shadow: 0 0 6px black;
      }
    `;
    document.head.appendChild(style);

    const dot = document.createElement('div');
    dot.id = 'ar-indicator';
    document.body.appendChild(dot);
    updateIndicator();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ']') {
      settings.enabled = !settings.enabled;
      saveSettings();
      updateIndicator();
      if (settings.enabled) startAutoRefresh();
      else stopAutoRefresh();
    }
  });

  createIndicator();
  if (settings.enabled) startAutoRefresh();
})();