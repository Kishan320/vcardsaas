import { watch, onMounted } from 'vue';
import { useBrand } from '@/contexts/BrandContext';
import { useAppearance } from './useAppearance';

export function useBrandTheme() {
  const { themeColor, customColor, themeMode } = useBrand();
  const { updateAppearance, updateThemeColor, updateCustomColor } = useAppearance();

  onMounted(() => {
    // Sync brand settings with appearance hook
    if (themeMode.value) {
      updateAppearance(themeMode.value as 'light' | 'dark' | 'system');
    }
  });

  watch(themeMode, (newMode) => {
    if (newMode) {
      updateAppearance(newMode as 'light' | 'dark' | 'system');
    }
  });

  watch(themeColor, (newColor) => {
    if (newColor) {
      updateThemeColor(newColor as any);
    }
  });

  watch([customColor, themeColor], ([newCustomColor, newThemeColor]) => {
    if (newCustomColor && newThemeColor === 'custom') {
      updateCustomColor(newCustomColor);
    }
  });
}
