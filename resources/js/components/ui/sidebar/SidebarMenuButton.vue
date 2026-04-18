<template>
  <Tooltip v-if="tooltip">
    <TooltipTrigger>
      <component
        :is="asChild ? 'div' : 'button'"
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        :data-size="size"
        :data-active="isActive"
        :class="[
          'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
          sizeClasses,
          variantClasses,
          $attrs.class
        ]"
      >
        <slot />
      </component>
    </TooltipTrigger>
    <TooltipContent
      side="right"
      align="center"
      :hidden="state !== 'collapsed' || isMobile"
    >
      {{ typeof tooltip === 'string' ? tooltip : tooltip.children }}
    </TooltipContent>
  </Tooltip>
  <component
    v-else
    :is="asChild ? 'div' : 'button'"
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    :data-size="size"
    :data-active="isActive"
    :class="[
      'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
      sizeClasses,
      variantClasses,
      $attrs.class
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, computed, type Ref } from 'vue';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const props = withDefaults(defineProps<{
  asChild?: boolean;
  isActive?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  tooltip?: string | { children: string };
}>(), {
  asChild: false,
  isActive: false,
  variant: 'default',
  size: 'default',
});

const { isMobile, state } = inject('sidebarContext') as { isMobile: Ref<boolean>, state: Ref<'expanded' | 'collapsed'> };

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-7 text-xs';
    case 'lg': return 'h-12 text-sm group-data-[collapsible=icon]:p-0!';
    case 'default':
    default: return 'h-8 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline': return 'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent)))]';
    case 'default':
    default: return 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';
  }
});
</script>
