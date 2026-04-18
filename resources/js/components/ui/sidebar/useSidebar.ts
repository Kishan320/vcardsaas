import { inject, type Ref } from 'vue';

export function useSidebar() {
  const context = inject('sidebarContext') as {
    state: Ref<'expanded' | 'collapsed'>,
    open: Ref<boolean>,
    setOpen: (val: boolean) => void,
    openMobile: Ref<boolean>,
    setOpenMobile: (val: boolean) => void,
    isMobile: Ref<boolean>,
    toggleSidebar: () => void,
  } | null;

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}
