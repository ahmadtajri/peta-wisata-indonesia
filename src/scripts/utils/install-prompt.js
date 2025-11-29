const InstallPrompt = {
  deferredPrompt: null,
  isInstalled: false,
  bannerResizeObserver: null,

  // ========================================
  // Initialize Install Prompt
  // ========================================
  init() {
    // Check if already installed
    this.checkInstallStatus();

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[Install] 💾 beforeinstallprompt event fired');

      // Prevent default browser prompt
      e.preventDefault();

      // Store event for later use
      this.deferredPrompt = e;

      // Show custom install button/banner
      this.showInstallUI();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('[Install] ✅ PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallUI();
      this.deferredPrompt = null;

      // Save to localStorage
      localStorage.setItem('pwa_installed', 'true');

      // Show success message
      this.showSuccessMessage();
    });

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[Install] 📱 Running in standalone mode');
      this.isInstalled = true;
      this.hideInstallUI();
    }
  },

  // ========================================
  // Check Install Status
  // ========================================
  checkInstallStatus() {
    // Check from localStorage
    const wasInstalled = localStorage.getItem('pwa_installed') === 'true';

    // Check if running as standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // iOS Safari
    const isIOSStandalone = window.navigator.standalone === true;

    this.isInstalled = wasInstalled || isStandalone || isIOSStandalone;

    if (this.isInstalled) {
      console.log('[Install] ✅ App already installed');
      this.hideInstallUI();
    }
  },

  // ========================================
  // Show Install UI
  // ========================================
  showInstallUI() {
    // Create install banner
    const existingBanner = document.getElementById('install-banner');
    if (existingBanner) {
      existingBanner.style.display = 'flex';
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-icon">📱</div>
        <div class="install-text">
          <strong>Install Peta Wisata</strong>
          <p>Akses lebih cepat dan bisa offline</p>
        </div>
        <button id="install-button" class="install-btn">Install</button>
        <button id="install-close" class="install-close" aria-label="Close">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Calculate height and set CSS variable
    const updateBannerHeight = () => {
      const height = banner.offsetHeight;
      document.body.style.setProperty('--banner-height', `${height}px`);
    };

    // Initial calculation
    updateBannerHeight();

    // Observe resize
    const resizeObserver = new ResizeObserver(() => {
      updateBannerHeight();
    });
    resizeObserver.observe(banner);
    this.bannerResizeObserver = resizeObserver;

    // Show animation
    setTimeout(() => {
      banner.classList.add('show');
      document.body.classList.add('has-install-banner');
    }, 100);

    // Add event listeners
    document.getElementById('install-button')?.addEventListener('click', () => {
      this.promptInstall();
    });

    document.getElementById('install-close')?.addEventListener('click', () => {
      this.hideInstallUI();
      // Don't show again for 7 days
      localStorage.setItem('install_prompt_dismissed', Date.now().toString());
    });
  },

  // ========================================
  // Hide Install UI
  // ========================================
  hideInstallUI() {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.classList.remove('show');
      document.body.classList.remove('has-install-banner');

      // Cleanup observer
      if (this.bannerResizeObserver) {
        this.bannerResizeObserver.disconnect();
        this.bannerResizeObserver = null;
      }

      setTimeout(() => {
        banner.remove();
        document.body.style.removeProperty('--banner-height');
      }, 300);
    }
  },

  // ========================================
  // Prompt Install
  // ========================================
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.warn('[Install] ⚠️ Install prompt not available');

      // Show manual install instructions
      this.showManualInstructions();
      return;
    }

    try {
      // Show install prompt
      this.deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log('[Install] User choice:', outcome);

      if (outcome === 'accepted') {
        console.log('[Install] ✅ User accepted install');
        this.hideInstallUI();
      } else {
        console.log('[Install] ❌ User dismissed install');
      }

      // Clear deferred prompt
      this.deferredPrompt = null;
    } catch (error) {
      console.error('[Install] Error prompting install:', error);
    }
  },

  // ========================================
  // Show Manual Instructions (untuk iOS)
  // ========================================
  showManualInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let instructions = '';

    if (isIOS) {
      instructions = `
        <div class="install-instructions">
          <h3>📱 Cara Install di iOS</h3>
          <ol>
            <li>Tap tombol <strong>Share</strong> (ikon kotak dengan panah ke atas)</li>
            <li>Scroll ke bawah dan tap <strong>"Add to Home Screen"</strong></li>
            <li>Tap <strong>"Add"</strong> di pojok kanan atas</li>
          </ol>
        </div>
      `;
    } else {
      instructions = `
        <div class="install-instructions">
          <h3>💻 Cara Install</h3>
          <p>Gunakan menu browser:</p>
          <ul>
            <li><strong>Chrome:</strong> Menu (⋮) → Install app / Add to Home screen</li>
            <li><strong>Edge:</strong> Menu (⋯) → Apps → Install this site as an app</li>
            <li><strong>Firefox:</strong> Address bar → Install icon</li>
          </ul>
        </div>
      `;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'install-modal';
    modal.innerHTML = `
      <div class="install-modal-content">
        ${instructions}
        <button class="install-btn" onclick="this.closest('.install-modal').remove()">
          Mengerti
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  // ========================================
  // Show Success Message
  // ========================================
  showSuccessMessage() {
    const toast = document.createElement('div');
    toast.className = 'install-toast';
    toast.innerHTML = `
      <div class="install-toast-content">
        ✅ Aplikasi berhasil diinstall!
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  },

  // ========================================
  // Check if should show prompt
  // ========================================
  shouldShowPrompt() {
    // Don't show if already installed
    if (this.isInstalled) {
      return false;
    }

    // Don't show if dismissed recently (7 days)
    const dismissedTime = localStorage.getItem('install_prompt_dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return false;
      }
    }

    return true;
  },
};

export default InstallPrompt;