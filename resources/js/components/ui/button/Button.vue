<template>
  <component
    :is="as"
    data-slot="button"
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer',
      variantClass,
      sizeClass,
      $attrs.class
    ]"
    :type="as === 'button' ? type : undefined"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  as?: string;
  type?: string;
}>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
  type: 'button',
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40';
    case 'outline':
      return 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80';
    case 'ghost':
      return 'hover:bg-accent hover:text-accent-foreground';
    case 'link':
      return 'text-primary underline-offset-4 hover:underline';
    case 'default':
    default:
      return 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 rounded-md px-3 has-[>svg]:px-2.5';
    case 'lg':
      return 'h-10 rounded-md px-6 has-[>svg]:px-4';
    case 'icon':
      return 'size-9';
    case 'default':
    default:
      return 'h-9 px-4 py-2 has-[>svg]:px-3';
  }
});
</script>
