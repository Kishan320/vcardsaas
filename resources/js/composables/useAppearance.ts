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

// Module-level cache — set from DB via initializeTheme, never from localStorage
let _currentTheme: ThemeSettings = { ...DEFAULT_THEME };

const prefersDark = () => {
    if (typeof window === 'undefined') return false;
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
        return false;
    }
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const hexToHsl = (hex: string): string => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
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
    if (typeof document === 'undefined') return;

    const { appearance, themeColor, customColor } = settings;
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);

    const color = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--ring', hsl);
    document.documentElement.style.setProperty('--chart-1', color);

    const adjustedColor = isDark ? lightenColor(color, 10) : darkenColor(color, 10);
    document.documentElement.style.setProperty('--theme-color-hover', adjustedColor);
};

const handleSystemThemeChange = () => {
    applyTheme(_currentTheme);
};

// Called once from app.ts with DB globalSettings — this is the single source of truth
export function initializeTheme(brandSettings?: any) {
    if (brandSettings && (brandSettings.themeColor || brandSettings.themeMode)) {
        _currentTheme = {
            appearance: (brandSettings.themeMode as Appearance) || DEFAULT_THEME.appearance,
            themeColor: (brandSettings.themeColor as ThemeColor) || DEFAULT_THEME.themeColor,
            customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
        };
    } else {
        _currentTheme = { ...DEFAULT_THEME };
    }

    applyTheme(_currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const themeSettings = ref<ThemeSettings>({ ..._currentTheme });

    const updateAppearance = (mode: Appearance) => {
        _currentTheme = { ..._currentTheme, appearance: mode };
        setCookie('appearance', mode);
        applyTheme(_currentTheme);
        themeSettings.value = { ..._currentTheme };
    };

    const updateThemeColor = (color: ThemeColor) => {
        _currentTheme = { ..._currentTheme, themeColor: color };
        applyTheme(_currentTheme);
        themeSettings.value = { ..._currentTheme };
    };

    const updateCustomColor = (hexColor: string, setAsActive = false) => {
        _currentTheme = {
            ..._currentTheme,
            customColor: hexColor,
            ...(setAsActive && { themeColor: 'custom' as ThemeColor }),
        };
        applyTheme(_currentTheme);
        themeSettings.value = { ..._currentTheme };
    };

    onMounted(() => {
        // Re-apply from module cache (already set from DB by initializeTheme)
        themeSettings.value = { ..._currentTheme };
        applyTheme(_currentTheme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery?.addEventListener('change', handleSystemThemeChange);

        onUnmounted(() => {
            mediaQuery?.removeEventListener('change', handleSystemThemeChange);
        });
    });

    const initializeWithBrandSettings = (brandSettings: any) => {
        initializeTheme(brandSettings);
        themeSettings.value = { ..._currentTheme };
    };

    return {
        appearance: themeSettings.value.appearance,
        themeColor: themeSettings.value.themeColor,
        customColor: themeSettings.value.customColor,
        updateAppearance,
        updateThemeColor,
        updateCustomColor,
        initializeWithBrandSettings,
    };
}
