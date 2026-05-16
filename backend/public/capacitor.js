// Capacitor initialization for mobile features
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.Capacitor) return;
  
  console.log('[Capacitor] Initializing...');
  
  const { Capacitor } = window;
  
  // Check platform
  const isNative = Capacitor.isNativePlatform();
  console.log('[Capacitor] Native platform:', isNative);
  
  if (isNative) {
    // Add native class to body for styling
    document.body.classList.add('capacitor');
    
    // Initialize preferences plugin
    try {
      const { Preferences } = await import('@capacitor/preferences');
      console.log('[Capacitor] Preferences ready');
    } catch (e) {
      console.log('[Capacitor] Preferences not available');
    }
    
    // Request notification permissions on Android
    if (Capacitor.getPlatform() === 'android') {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.requestPermissions();
        console.log('[Capacitor] Notifications permission granted');
      } catch (e) {
        console.log('[Capacitor] Notifications not available');
      }
    }
  }
});

// Export for use in app
window.CapacitorApp = {
  showToast: async (message) => {
    if (window.Capacitor?.isNativePlatform()) {
      // Use native toast via Haptics feedback as fallback
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {}
    }
  },
  
  getPlatform: () => {
    return window.Capacitor?.getPlatform() || 'web';
  },
  
  isNative: () => {
    return window.Capacitor?.isNativePlatform() || false;
  }
};