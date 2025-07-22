(() => {
  if (document.getElementById('auto-refresh-menu')) return;

  const STORAGE_KEY = 'autoRefreshSettings';
  let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    interval: 5,
    enabled: false,
  };

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function createMenu() {
    const style = document.createElement('style');
    style.textContent = `
      #auto-refresh-menu {
        position: fixed;
        top: 15px;
        right: 15px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        border-radius: 8px;
        padding: 8px 12px;
        z-index: 9999999;
        user-select: none;
        box-shadow: 0 0 10px black;
        display: none; /* Start hidden */
        align-items: center;
        gap: 10px;
      }
      #auto-refresh-menu h3 {
        margin: 0;
        font-weight: bold;
        font-size: 16px;
        user-select: none;
      }
      #auto-refresh-menu button {
        background: #2a2a2a;
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        user-select: none;
      }
      #auto-refresh-menu button:hover {
        background: #444;
      }
      #ar-seconds {
        min-width: 25px;
        text-align: center;
        user-select: none;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'auto-refresh-menu';
    menu.innerHTML = `
      <h3>Auto Refresh</h3>
      <button id="ar-decrease">-</button>
      <span id="ar-seconds">${settings.interval}</span> sec
      <button id="ar-increase">+</button>
      <span id="ar-status" style="margin-left:12px; user-select:none; font-weight:bold;">Auto-refresh: ${settings.enabled ? 'ON' : 'OFF'}</span>
    `;
    document.body.appendChild(menu);

    document.getElementById('ar-increase').onclick = () => {
      if (settings.interval < 3600) settings.interval++;
      saveSettings();
      updateStatus();
      if (settings.enabled) startAutoRefresh();
    };

    document.getElementById('ar-decrease').onclick = () => {
      if (settings.interval > 1) settings.interval--;
      saveSettings();
      updateStatus();
      if (settings.enabled) startAutoRefresh();
    };

    document.addEventListener('keydown', e => {
      if (e.key === ']') {
        settings.enabled = !settings.enabled;
        saveSettings();
        if (settings.enabled) startAutoRefresh();
        else stopAutoRefresh();
        updateStatus();
      } else if (e.key === '[') {
        // Toggle visibility
        menu.style.display = (menu.style.display === 'none') ? 'flex' : 'none';
      }
    });

    updateStatus();
  }

  let refreshTimer = null;

  function updateStatus() {
    const status = document.getElementById('ar-status');
    if (status) {
      status.textContent = `Auto-refresh: ${settings.enabled ? 'ON' : 'OFF'}`;
    }
    const seconds = document.getElementById('ar-seconds');
    if (seconds) {
      seconds.textContent = settings.interval;
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

  createMenu();
  if (settings.enabled) startAutoRefresh();
})();
