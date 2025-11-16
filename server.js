const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ========================================
// VAPID KEYS - Ganti dengan keys Anda!
// ========================================
const VAPID_PUBLIC_KEY = 'BEWn5cwqHObW8NJmgfjzHr3AFUJ0n189r5GJlUzvilhp-egMGgACY6t8Ck5ZsdbL60YBIsniJPpgqPEu73_fGik';
const VAPID_PRIVATE_KEY = 'tQ0HrZaV6xTCVln4t0wlC3F1pFS_I-6xYRe0ryoA4Ng';

webpush.setVapidDetails(
  'mailto:f262d5y0110@student.devacademy.id', // Ganti dengan email Anda
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// In-memory storage (gunakan database di production)
const subscriptions = new Map();

// ========================================
// ENDPOINT: Subscribe
// ========================================
app.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  const user = req.body.user;

  console.log('📩 New subscription received:', {
    endpoint: subscription.endpoint,
    user: user?.name || 'Anonymous',
  });

  // Simpan subscription (gunakan user ID sebagai key)
  const userId = user?.email || subscription.endpoint;
  subscriptions.set(userId, subscription);

  res.status(201).json({ 
    success: true, 
    message: 'Subscription saved',
    totalSubscriptions: subscriptions.size,
  });
});

// ========================================
// ENDPOINT: Unsubscribe
// ========================================
app.delete('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  
  // Hapus subscription berdasarkan endpoint
  for (const [key, sub] of subscriptions.entries()) {
    if (sub.endpoint === subscription.endpoint) {
      subscriptions.delete(key);
      console.log('🗑️  Subscription removed:', key);
      break;
    }
  }

  res.json({ 
    success: true, 
    message: 'Subscription removed',
    totalSubscriptions: subscriptions.size,
  });
});

// ========================================
// ENDPOINT: Send Push to All
// ========================================
app.post('/send-push', async (req, res) => {
  const { title, body, url, storyId, image, icon } = req.body;

  if (subscriptions.size === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'No subscriptions available' 
    });
  }

  // 🎯 SKILLED: Payload dinamis dari server
  const payload = JSON.stringify({
    title: title || 'Peta Wisata Indonesia',
    body: body || 'Ada update baru!',
    icon: icon || '/images/icon-192.png',
    badge: '/images/icon-192.png',
    image: image || null,
    url: url || '/',
    storyId: storyId || null,
    tag: storyId ? `story-${storyId}` : 'general',
    requireInteraction: false,
    // 🎯 ADVANCED: Actions
    actions: [
      {
        action: 'view',
        title: '👁️ Lihat Detail',
      },
      {
        action: 'close',
        title: '❌ Tutup',
      },
    ],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: storyId || 1,
    },
  });

  console.log('📤 Sending push notification to', subscriptions.size, 'subscribers');

  const results = [];

  // Kirim ke semua subscribers
  for (const [userId, subscription] of subscriptions.entries()) {
    try {
      const result = await webpush.sendNotification(subscription, payload);
      results.push({ userId, success: true, status: result.statusCode });
      console.log(`✅ Sent to ${userId}: ${result.statusCode}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${userId}:`, error.message);
      
      // Hapus subscription jika expired (410 Gone)
      if (error.statusCode === 410) {
        subscriptions.delete(userId);
        console.log(`🗑️  Removed expired subscription: ${userId}`);
      }
      
      results.push({ userId, success: false, error: error.message });
    }
  }

  res.json({ 
    success: true, 
    message: 'Push notifications sent',
    results,
    totalSent: results.filter(r => r.success).length,
    totalFailed: results.filter(r => !r.success).length,
  });
});

// ========================================
// ENDPOINT: Send Push to Specific User
// ========================================
app.post('/send-push-to-user', async (req, res) => {
  const { userId, title, body, url, storyId } = req.body;

  const subscription = subscriptions.get(userId);

  if (!subscription) {
    return res.status(404).json({ 
      success: false, 
      error: 'User subscription not found' 
    });
  }

  const payload = JSON.stringify({
    title: title || 'Peta Wisata Indonesia',
    body: body || 'Ada update baru untuk Anda!',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    url: url || '/',
    storyId: storyId || null,
    tag: storyId ? `story-${storyId}` : 'general',
    actions: [
      { action: 'view', title: '👁️ Lihat Detail' },
      { action: 'close', title: '❌ Tutup' },
    ],
  });

  try {
    const result = await webpush.sendNotification(subscription, payload);
    console.log(`✅ Push sent to ${userId}: ${result.statusCode}`);
    
    res.json({ 
      success: true, 
      message: 'Push notification sent',
      statusCode: result.statusCode,
    });
  } catch (error) {
    console.error(`❌ Failed to send to ${userId}:`, error.message);
    
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
      console.log(`🗑️  Removed expired subscription: ${userId}`);
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// ENDPOINT: Get Stats
// ========================================
app.get('/stats', (req, res) => {
  res.json({
    totalSubscriptions: subscriptions.size,
    subscribers: Array.from(subscriptions.keys()),
  });
});

// ========================================
// ENDPOINT: Test Push (untuk debugging)
// ========================================
app.get('/test-push', async (req, res) => {
  if (subscriptions.size === 0) {
    return res.status(400).json({ error: 'No subscriptions' });
  }

  const payload = JSON.stringify({
    title: '🧪 Test Notification',
    body: 'Ini adalah test push notification dari server',
    icon: '/images/icon-192.png',
    url: '/',
    tag: 'test',
  });

  try {
    const firstSubscription = subscriptions.values().next().value;
    const result = await webpush.sendNotification(firstSubscription, payload);
    
    res.json({ 
      success: true, 
      message: 'Test push sent',
      statusCode: result.statusCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Push notification server running on http://localhost:${PORT}`);
  console.log(`📊 Stats: http://localhost:${PORT}/stats`);
  console.log(`🧪 Test: http://localhost:${PORT}/test-push`);
});