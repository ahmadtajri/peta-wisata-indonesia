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
      // 1. Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready for push subscription');

      // 2. Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log('Already subscribed to push notifications');
        // Send existing subscription to Dicoding API
        await this.sendSubscriptionToDicodingAPI(subscription);
        return subscription;
      }

      // 3. Request permission if needed
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error('Permission tidak diberikan');
      }

      // 4. Subscribe with VAPID key
      const vapidPublicKey = CONFIG.PUSH_NOTIFICATION.PUBLIC_VAPID_KEY;
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      console.log('✅ Push subscription created:', subscription);

      // 5. Send subscription to Dicoding API
      await this.sendSubscriptionToDicodingAPI(subscription);

      // 6. Save status
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

      // Delete from Dicoding API first
      await this.deleteSubscriptionFromDicodingAPI(subscription);

      // Then unsubscribe locally
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed from push notifications');

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
  // Send Subscription to Dicoding API
  // ========================================
  async sendSubscriptionToDicodingAPI(subscription) {
    try {
      const user = JSON.parse(localStorage.getItem('dicoding_story_user') || '{}');

      if (!user || !user.token) {
        console.warn('⚠️ User belum login, skip send subscription to API');
        return;
      }

      // Convert subscription to JSON
      const subscriptionJSON = subscription.toJSON();

      // Format sesuai dokumentasi Dicoding API
      const payload = {
        endpoint: subscriptionJSON.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
      };

      const endpoint = `${CONFIG.BASE_URL}notifications/subscribe`;

      console.log('📤 Sending subscription to Dicoding API:', endpoint);
      console.log('📦 Payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe');
      }

      console.log('✅ Subscription sent to Dicoding API:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending subscription to Dicoding API:', error);
      // Don't throw - subscription masih valid locally
    }
  },

  // ========================================
  // Delete Subscription from Dicoding API
  // ========================================
  async deleteSubscriptionFromDicodingAPI(subscription) {
    try {
      const user = JSON.parse(localStorage.getItem('dicoding_story_user') || '{}');

      if (!user || !user.token) {
        console.warn('⚠️ User belum login, skip delete subscription from API');
        return;
      }

      const endpoint = `${CONFIG.BASE_URL}notifications/unsubscribe`;

      console.log('📤 Deleting subscription from Dicoding API:', endpoint);

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to unsubscribe');
      }

      console.log('✅ Subscription deleted from Dicoding API');
    } catch (error) {
      console.error('❌ Error deleting subscription from Dicoding API:', error);
    }
  },

  // ========================================
  // Test Notification (Local Only)
  // ========================================
  async testNotification() {
    if (Notification.permission !== 'granted') {
      await this.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;

      registration.showNotification('Test Notification 🧪', {
        body: 'Ini adalah test notification dari Peta Wisata Indonesia',
        icon: '/public/icons/icon-192x192.png',
        badge: '/public/icons/icon-192x192.png',
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