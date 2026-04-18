<template>
  <div v-if="collapsible === 'none'" data-slot="sidebar" :class="['bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col', $attrs.class]">
    <slot />
  </div>

  <template v-else-if="isMobile">
    <Sheet :open="openMobile" @update:open="setOpenMobile">
      <SheetContent
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        side="left"
        class="bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0 [&>button]:hidden"
        :style="{ '--sidebar-width': '18rem' }"
      >
        <div class="flex h-full w-full flex-col">
          <slot />
        </div>
      </SheetContent>
    </Sheet>
  </template>

  <div
    v-else
    class="group peer text-sidebar-foreground hidden md:block"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? collapsible : ''"
    :data-variant="variant"
    :data-side="side"
    data-slot="sidebar"
  >
    <div
      :class="[
        'relative h-svh w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear',
        'group-data-[collapsible=offcanvas]:w-0',
        'group-data-[side=right]:rotate-180',
        variant === 'floating' || variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]'
          : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]'
      ]"
    />
    <div
      :class="[
        'fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex',
        side === 'left'
          ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
          : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
        variant === 'floating' || variant === 'inset'
          ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]'
          : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l',
        $attrs.class
      ]"
    >
      <div
        data-sidebar="sidebar"
        class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const props = withDefaults(defineProps<{
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}>(), {
  side: 'left',
  variant: 'sidebar',
  collapsible: 'offcanvas',
});

interface SidebarContext {
  state: Ref<'expanded' | 'collapsed'>;
  open: Ref<boolean>;
  openMobile: Ref<boolean>;
  setOpenMobile: (val: boolean) => void;
  isMobile: Ref<boolean>;
}

const { isMobile, state, openMobile, setOpenMobile } = inject('sidebarContext') as SidebarContext;
</script>
