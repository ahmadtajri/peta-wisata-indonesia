import CONFIG from '../config.js';

const PushNotification = {
  // ========================================
  // Check Browser Support
  // ========================================
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  // ========================================
  // Request Notification Permission
  // ========================================
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn('Push notification tidak didukung di browser ini');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);

      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        return true;
      } else if (permission === 'denied') {
        console.warn('❌ Notification permission denied');
        return false;
      } else {
        console.log('⚠️ Notification permission dismissed');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  // ========================================
  // Convert VAPID Key to Uint8Array
  // ========================================
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  // ========================================
  // Subscribe to Push Notifications
  // ========================================
  async subscribe() {
    if (!this.isSupported()) {
      throw new Error('Push notification tidak didukung');
    }

    try {
      // 1. Dapatkan service worker registration
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready for push subscription');

      // 2. Cek apakah sudah subscribe
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log('Already subscribed to push notifications');
        return subscription;
      }

      // 3. Request permission jika belum
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error('Permission tidak diberikan');
      }

      // 4. Subscribe dengan VAPID key
      const vapidPublicKey = CONFIG.PUSH_NOTIFICATION.PUBLIC_VAPID_KEY;
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Wajib: notifikasi harus visible
        applicationServerKey: convertedVapidKey,
      });

      console.log('✅ Push subscription created:', subscription);

      // 5. Kirim subscription ke server
      await this.sendSubscriptionToServer(subscription);

      // 6. Simpan status di localStorage
      localStorage.setItem('push_subscription_enabled', 'true');

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    }
  },

  // ========================================
  // Unsubscribe from Push Notifications
  // ========================================
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log('Not subscribed to push notifications');
        return;
      }

      // Unsubscribe
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed from push notifications');

      // Hapus dari server
      await this.removeSubscriptionFromServer(subscription);

      // Update localStorage
      localStorage.setItem('push_subscription_enabled', 'false');
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      throw error;
    }
  },

  // ========================================
  // Check Subscription Status
  // ========================================
  async getSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  },

  // ========================================
  // Send Subscription to Server
  // ========================================
  async sendSubscriptionToServer(subscription) {
    try {
      const serverUrl = CONFIG.PUSH_NOTIFICATION.SERVER_URL;

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          user: JSON.parse(localStorage.getItem('dicoding_story_user') || '{}'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      const result = await response.json();
      console.log('Subscription sent to server:', result);
      return result;
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      // Jangan throw error di sini agar subscription tetap tersimpan lokal
      // throw error;
    }
  },

  // ========================================
  // Remove Subscription from Server
  // ========================================
  async removeSubscriptionFromServer(subscription) {
    try {
      const serverUrl = CONFIG.PUSH_NOTIFICATION.SERVER_URL;

      await fetch(serverUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      console.log('Subscription removed from server');
    } catch (error) {
      console.error('Error removing subscription from server:', error);
    }
  },

  // ========================================
  // Test Notification (for debugging)
  // ========================================
  async testNotification() {
    if (Notification.permission !== 'granted') {
      await this.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      
      registration.showNotification('Test Notification', {
        body: 'Ini adalah test notification dari Peta Wisata Indonesia',
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        tag: 'test-notification',
        actions: [
          { action: 'view', title: 'Lihat' },
          { action: 'close', title: 'Tutup' },
        ],
        data: {
          url: '/',
        },
      });

      console.log('✅ Test notification displayed');
    }
  },
};

export default PushNotification;