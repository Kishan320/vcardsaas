import { ref, watch, onMounted } from 'vue';
import { useAppearance } from './useAppearance';
import { useLayout } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';

export function useThemePreview() {
  const { appearance, themeColor } = useAppearance();
  const { position } = useLayout();
  const { variant, collapsible, style } = useSidebarSettings();
  
  const debouncedSettings = ref({
    appearance: appearance.value,
    themeColor: themeColor.value,
    position: position.value,
    variant: variant,
    collapsible: collapsible,
    style: style
  });
  
  onMounted(() => {
    updateDebouncedSettings();
  });

  watch([appearance, themeColor, position, variant, collapsible, style], () => {
    updateDebouncedSettings();
  });

  const updateDebouncedSettings = () => {
    const timer = setTimeout(() => {
      debouncedSettings.value = {
        appearance: appearance.value,
        themeColor: themeColor.value,
        position: position.value,
        variant: variant,
        collapsible: collapsible,
        style: style
      };
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  return debouncedSettings;
}
