import { ref, onMounted, onUnmounted } from 'vue';

type SidebarVariant = 'inset' | 'floating' | 'sidebar';
type SidebarCollapsible = 'icon' | 'offcanvas' | 'none';

interface SidebarSettings {
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
}

interface ExtendedSidebarSettings extends SidebarSettings {
  style: string;
}

const DEFAULT_EXTENDED_SETTINGS: ExtendedSidebarSettings = {
  variant: 'inset',
  collapsible: 'icon',
  style: 'plain'
};

const getExtendedSidebarSettings = (): ExtendedSidebarSettings => {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_EXTENDED_SETTINGS;
  }
  
  try {
    const savedSettings = localStorage.getItem('sidebarSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_EXTENDED_SETTINGS;
  } catch (error) {
    return DEFAULT_EXTENDED_SETTINGS;
  }
};

const settings = ref<ExtendedSidebarSettings>(getExtendedSidebarSettings());

export function useSidebarSettings() {
  const updateVariant = (variant: SidebarVariant) => {
    settings.value.variant = variant;
    localStorage.setItem('sidebarSettings', JSON.stringify(settings.value));
  };

  const updateCollapsible = (collapsible: SidebarCollapsible) => {
    settings.value.collapsible = collapsible;
    localStorage.setItem('sidebarSettings', JSON.stringify(settings.value));
  };

  const updateStyle = (style: string) => {
    settings.value.style = style;
    localStorage.setItem('sidebarSettings', JSON.stringify(settings.value));
  };

  onMounted(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sidebarSettings') {
        try {
          const newSettings = JSON.parse(event.newValue || '');
          settings.value = newSettings;
        } catch (error) {
          console.error('Failed to parse sidebar settings', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
    });
  });

  return {
    variant: settings.value.variant,
    collapsible: settings.value.collapsible,
    style: settings.value.style,
    updateVariant,
    updateCollapsible,
    updateStyle,
  };
}
