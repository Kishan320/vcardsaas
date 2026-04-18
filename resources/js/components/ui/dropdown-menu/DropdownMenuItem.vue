<template>
  <div
    data-slot="dropdown-menu-item"
    :data-variant="variant"
    :class="[
      'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      $attrs.class
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps<{
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}>();

const { close } = inject('dropdownContext') as { close: () => void };

const handleClick = () => {
  if (props.disabled) return;
  close();
};
</script>
