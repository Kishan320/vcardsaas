export type LayoutPosition = 'left' | 'right';

export interface LayoutContext {
  position: LayoutPosition;
  collapsed: boolean;
  toggleCollapsed: () => void;
}
