export type ThemeColor = string;

export type Appearance = {
  theme: 'light' | 'dark' | 'system';
  themeColor: ThemeColor;
  layoutPosition: 'left' | 'right';
};

export const THEME_COLORS = {
  blue: 'blue',
  green: 'green',
  purple: 'purple',
  red: 'red',
  orange: 'orange',
  pink: 'pink',
  yellow: 'yellow',
  teal: 'teal',
  indigo: 'indigo',
  gray: 'gray',
} as const;

export function useAppearance() {
  const getThemeColor = () => {
    return window.appSettings?.themeColor || THEME_COLORS.blue;
  };

  const getCustomColor = () => {
    return window.appSettings?.customColor || null;
  };

  return {
    themeColor: getThemeColor(),
    customColor: getCustomColor(),
  };
}
