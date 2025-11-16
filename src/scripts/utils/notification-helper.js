import PushNotification from './push-notification.js';

const NotificationHelper = {
  // ========================================
  // Initialize Notification Toggle UI
  // ========================================
  async init() {
    const toggleButton = document.getElementById('notificationToggle');
    const icon = document.getElementById('notificationIcon');

    if (!toggleButton) {
      console.warn('Notification toggle button not found');
      return;
    }

    // Check if push notification is supported
    if (!PushNotification.isSupported()) {
      toggleButton.style.display = 'none';
      console.warn('Push notification not supported in this browser');
      return;
    }

    // Update UI based on current status
    await this.updateToggleUI();

    // Add click listener
    toggleButton.addEventListener('click', async () => {
      await this.handleToggleClick();
    });

    console.log('✅ Notification toggle initialized');
  },

  // ========================================
  // Update Toggle UI
  // ========================================
  async updateToggleUI() {
    const toggleButton = document.getElementById('notificationToggle');
    const icon = document.getElementById('notificationIcon');

    if (!toggleButton || !icon) return;

    try {
      const isSubscribed = await PushNotification.getSubscriptionStatus();
      const permission = Notification.permission;

      if (isSubscribed && permission === 'granted') {
        icon.textContent = '🔔'; // Bell ON
        toggleButton.classList.add('active');
        toggleButton.setAttribute('aria-label', 'Disable push notifications');
        toggleButton.title = 'Notifikasi Aktif - Klik untuk nonaktifkan';
      } else {
        icon.textContent = '🔕'; // Bell OFF
        toggleButton.classList.remove('active');
        toggleButton.setAttribute('aria-label', 'Enable push notifications');
        toggleButton.title = 'Notifikasi Nonaktif - Klik untuk aktifkan';
      }
    } catch (error) {
      console.error('Error updating toggle UI:', error);
    }
  },

  // ========================================
  // Handle Toggle Click
  // ========================================
  async handleToggleClick() {
    const toggleButton = document.getElementById('notificationToggle');
    
    // Disable button sementara
    toggleButton.disabled = true;
    this.showLoading(true);

    try {
      const isSubscribed = await PushNotification.getSubscriptionStatus();

      if (isSubscribed) {
        // Unsubscribe
        await PushNotification.unsubscribe();
        this.showMessage('Notifikasi dinonaktifkan', 'success');
      } else {
        // Subscribe
        await PushNotification.subscribe();
        this.showMessage('Notifikasi diaktifkan! Anda akan menerima update terbaru.', 'success');
      }

      // Update UI
      await this.updateToggleUI();
    } catch (error) {
      console.error('Error toggling notification:', error);
      
      if (error.message.includes('Permission')) {
        this.showMessage('Izin notifikasi ditolak. Silakan aktifkan dari pengaturan browser.', 'error');
      } else {
        this.showMessage('Gagal mengaktifkan notifikasi. Silakan coba lagi.', 'error');
      }
    } finally {
      toggleButton.disabled = false;
      this.showLoading(false);
    }
  },

  // ========================================
  // Show Loading State
  // ========================================
  showLoading(show) {
    const icon = document.getElementById('notificationIcon');
    if (!icon) return;

    if (show) {
      icon.textContent = '⏳';
    } else {
      // Will be updated by updateToggleUI()
    }
  },

  // ========================================
  // Show Toast Message
  // ========================================
  showMessage(message, type = 'info') {
    // Buat toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');

    document.body.appendChild(toast);

    // Show animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  },

  // ========================================
  // Show Permission Dialog
  // ========================================
  showPermissionDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'permission-dialog';
    dialog.innerHTML = `
      <div class="permission-dialog-content">
        <h3>🔔 Aktifkan Notifikasi</h3>
        <p>Dapatkan update terbaru tentang cerita wisata baru dan konten menarik lainnya.</p>
        <div class="permission-dialog-actions">
          <button id="allowNotification" class="btn-primary">Izinkan</button>
          <button id="denyNotification" class="btn-secondary">Nanti Saja</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Show animation
    setTimeout(() => {
      dialog.classList.add('show');
    }, 100);

    // Event listeners
    document.getElementById('allowNotification')?.addEventListener('click', async () => {
      dialog.remove();
      await this.handleToggleClick();
    });

    document.getElementById('denyNotification')?.addEventListener('click', () => {
      dialog.remove();
    });
  },

  // ========================================
  // Auto Prompt on First Visit
  // ========================================
  async autoPromptIfNeeded() {
    // Cek apakah user sudah pernah diminta permission
    const hasBeenPrompted = localStorage.getItem('notification_prompted');
    
    if (hasBeenPrompted) {
      return;
    }

    // Tunggu 5 detik setelah page load
    setTimeout(() => {
      if (Notification.permission === 'default') {
        this.showPermissionDialog();
        localStorage.setItem('notification_prompted', 'true');
      }
    }, 5000);
  },
};

export default NotificationHelper;