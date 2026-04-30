import { ref, onMounted, onUnmounted } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
  const isInstallable = ref(false);
  const isInstalled = ref(false);

  const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    deferredPrompt.value = e;
    isInstallable.value = true;
    isInstalled.value = false;
  };

  const handleAppInstalled = () => {
    isInstalled.value = true;
    isInstallable.value = false;
    deferredPrompt.value = null;
  };

  onMounted(() => {
    // Reset states for each business
    deferredPrompt.value = null;
    isInstallable.value = false;
    isInstalled.value = false;
    
    // Allow fresh install prompts for different businesses
    // Keep existing business PWA states intact

    // Clear any existing listeners
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.removeEventListener('appinstalled', handleAppInstalled);
    
    // Add new listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.removeEventListener('appinstalled', handleAppInstalled);
  });

  const install = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt.value) {
      return 'unavailable';
    }

    try {
      await deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;
      
      deferredPrompt.value = null;
      isInstallable.value = false;
      
      if (outcome === 'accepted') {
        isInstalled.value = true;
      }
      
      return outcome;
    } catch (error) {
      console.error('PWA install error:', error);
      return 'unavailable';
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
    canInstall: isInstallable.value && !isInstalled.value
  };
}
