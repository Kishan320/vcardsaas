import { ref, computed, watch, onMounted } from 'vue';
import { getBrandSettings, type BrandSettings } from '@/utils/brandSettings';
import { initializeTheme } from '@/composables/useAppearance';

const brandSettings = ref<BrandSettings>({
  logoDark: '/images/logos/logo-dark.png',
  logoLight: '/images/logos/logo-light.png',
  favicon: '/images/logos/favicon.ico',
  titleText: 'WorkDo',
  footerText: '© 2025 WorkDo. All rights reserved.',
  themeColor: 'blue',
  customColor: '#3b82f6',
  sidebarVariant: 'inset',
  sidebarStyle: 'plain',
  layoutDirection: 'left',
  themeMode: 'light',
});

const globalSettings = ref<any>(null);
const user = ref<any>(null);

export function useBrand() {
  const getEffectiveSettings = () => {
    const isPublicRoute = window.location.pathname.includes('/public/') || 
                         window.location.pathname === '/' || 
                         window.location.pathname.includes('/auth/');
    
    if (isPublicRoute) {
      return globalSettings.value;
    }
    
    if (user.value?.role === 'company' && user.value?.globalSettings) {
      return user.value.globalSettings;
    }
    
    return globalSettings.value;
  };

  const updateBrandSettings = (newSettings: Partial<BrandSettings>) => {
    brandSettings.value = { ...brandSettings.value, ...newSettings };
  };

  const applyThemeFromSettings = () => {
    const effectiveSettings = getEffectiveSettings();
    if (effectiveSettings?.themeMode && typeof window !== 'undefined') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = effectiveSettings.themeMode === 'dark' || 
        (effectiveSettings.themeMode === 'system' && systemDark);
      
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
    }
  };

  const initializeBrandSettings = (settings: any, currentUser: any) => {
    globalSettings.value = settings;
    user.value = currentUser;
    
    const effectiveSettings = getEffectiveSettings();
    const brandSettingsValue = getBrandSettings(effectiveSettings);
    brandSettings.value = brandSettingsValue;
    
    applyThemeFromSettings();
  };

  onMounted(() => {
    applyThemeFromSettings();
  });

  watch([globalSettings, user], () => {
    const effectiveSettings = getEffectiveSettings();
    const updatedSettings = getBrandSettings(effectiveSettings);
    brandSettings.value = updatedSettings;
    applyThemeFromSettings();
  });

  return {
    ...brandSettings.value,
    updateBrandSettings,
    initializeBrandSettings,
  };
}
