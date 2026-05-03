import { ref, computed, watch } from 'vue';
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
const currentUser = ref<any>(null);

// Derived reactive refs for individual brand properties
export const logoDark = computed(() => brandSettings.value.logoDark);
export const logoLight = computed(() => brandSettings.value.logoLight);
export const favicon = computed(() => brandSettings.value.favicon);
export const titleText = computed(() => brandSettings.value.titleText);
export const footerText = computed(() => brandSettings.value.footerText);
export const themeColor = computed(() => brandSettings.value.themeColor);
export const customColor = computed(() => brandSettings.value.customColor);
export const sidebarVariant = computed(() => brandSettings.value.sidebarVariant);
export const sidebarStyle = computed(() => brandSettings.value.sidebarStyle);
export const layoutDirection = computed(() => brandSettings.value.layoutDirection);
export const themeMode = computed(() => brandSettings.value.themeMode);

export function useBrand() {
  const applyThemeFromSettings = () => {
    const settings = brandSettings.value;
    if (settings?.themeMode && typeof window !== 'undefined') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = settings.themeMode === 'dark' ||
        (settings.themeMode === 'system' && systemDark);
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
    }
  };

  const updateBrandSettings = (newSettings: Partial<BrandSettings>) => {
    brandSettings.value = { ...brandSettings.value, ...newSettings };
    // Apply CSS variables live
    initializeTheme(brandSettings.value);
  };

  const initializeBrandSettings = (settings: any, user: any) => {
    globalSettings.value = settings;
    currentUser.value = user;
    const resolved = getBrandSettings(settings);
    brandSettings.value = resolved;
    applyThemeFromSettings();
  };

  watch(brandSettings, () => {
    applyThemeFromSettings();
  }, { deep: true });

  return {
    // Reactive computed refs
    logoDark,
    logoLight,
    favicon,
    titleText,
    footerText,
    themeColor,
    customColor,
    sidebarVariant,
    sidebarStyle,
    layoutDirection,
    themeMode,
    // Full settings ref
    brandSettings,
    // Methods
    updateBrandSettings,
    initializeBrandSettings,
  };
}
