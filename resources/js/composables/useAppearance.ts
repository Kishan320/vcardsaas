import { ref, onMounted, onUnmounted } from 'vue';

export type Appearance = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'custom';

export interface ThemeSettings {
    appearance: Appearance;
    themeColor: ThemeColor;
    customColor: string;
}

const DEFAULT_THEME: ThemeSettings = {
    appearance: 'light',
    themeColor: 'green',
    customColor: '#10b981',
};

export const THEME_COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f97316',
    red: '#ef4444',
};

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
        return false;
    }
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const lightenColor = (hex: string, percent: number): string => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    r = Math.min(255, Math.floor(r * (1 + percent / 100)));
    g = Math.min(255, Math.floor(g * (1 + percent / 100)));
    b = Math.min(255, Math.floor(b * (1 + percent / 100)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const darkenColor = (hex: string, percent: number): string => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const applyTheme = (settings: ThemeSettings) => {
    if (typeof document === 'undefined') {
        return;
    }
    
    const { appearance, themeColor, customColor } = settings;
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    
    const color = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--chart-1', color);
    
    const adjustedColor = isDark ? lightenColor(color, 10) : darkenColor(color, 10);
    document.documentElement.style.setProperty('--theme-color-hover', adjustedColor);
    
    const tempClass = 'theme-color-updating';
    document.documentElement.classList.add(tempClass);
    setTimeout(() => {
        document.documentElement.classList.remove(tempClass);
    }, 10);
};

const getThemeSettings = (brandSettings?: any): ThemeSettings => {
    if (typeof localStorage === 'undefined') {
        return brandSettings ? {
            appearance: brandSettings.themeMode || DEFAULT_THEME.appearance,
            themeColor: brandSettings.themeColor || DEFAULT_THEME.themeColor,
            customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
        } : DEFAULT_THEME;
    }
    
    try {
        const savedTheme = localStorage.getItem('themeSettings');
        if (savedTheme) {
            return JSON.parse(savedTheme);
        }
        
        if (brandSettings) {
            return {
                appearance: brandSettings.themeMode || DEFAULT_THEME.appearance,
                themeColor: brandSettings.themeColor || DEFAULT_THEME.themeColor,
                customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
            };
        }
        
        return DEFAULT_THEME;
    } catch (error) {
        return brandSettings ? {
            appearance: brandSettings.themeMode || DEFAULT_THEME.appearance,
            themeColor: brandSettings.themeColor || DEFAULT_THEME.themeColor,
            customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
        } : DEFAULT_THEME;
    }
};

const handleSystemThemeChange = () => {
    const themeSettings = getThemeSettings();
    applyTheme(themeSettings);
};

export function initializeTheme(brandSettings?: any) {
    const themeSettings = getThemeSettings(brandSettings);
    applyTheme(themeSettings);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const themeSettings = ref<ThemeSettings>(DEFAULT_THEME);

    const updateAppearance = (mode: Appearance) => {
        const newSettings = { ...themeSettings.value, appearance: mode };
        localStorage.setItem('themeSettings', JSON.stringify(newSettings));
        setCookie('appearance', mode);
        applyTheme(newSettings);
        themeSettings.value = newSettings;
    };
    
    const updateThemeColor = (color: ThemeColor) => {
        const newSettings = { ...themeSettings.value, themeColor: color };
        localStorage.setItem('themeSettings', JSON.stringify(newSettings));
        applyTheme(newSettings);
        themeSettings.value = newSettings;
    };
    
    const updateCustomColor = (hexColor: string, setAsActive = false) => {
        const newSettings: ThemeSettings = { 
            ...themeSettings.value, 
            customColor: hexColor,
            ...(setAsActive && { themeColor: 'custom' as ThemeColor })
        };
        localStorage.setItem('themeSettings', JSON.stringify(newSettings));
        applyTheme(newSettings);
        themeSettings.value = newSettings;
    };

    onMounted(() => {
        const savedSettings = getThemeSettings();
        const typedSettings: ThemeSettings = {
            appearance: savedSettings.appearance,
            themeColor: savedSettings.themeColor as ThemeColor,
            customColor: savedSettings.customColor,
        };
        themeSettings.value = typedSettings;
        applyTheme(typedSettings);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery?.addEventListener('change', handleSystemThemeChange);

        onUnmounted(() => {
            mediaQuery?.removeEventListener('change', handleSystemThemeChange);
        });
    });
    
    const initializeWithBrandSettings = (brandSettings: any) => {
        const settings = getThemeSettings(brandSettings);
        themeSettings.value = settings;
        applyTheme(settings);
    };

    return { 
        appearance: themeSettings.value.appearance, 
        themeColor: themeSettings.value.themeColor,
        customColor: themeSettings.value.customColor,
        updateAppearance,
        updateThemeColor,
        updateCustomColor,
        initializeWithBrandSettings
    };
}
