<template>
  <component
    :is="as"
    data-slot="badge"
    :class="[
      'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-auto',
      variantClass,
      $attrs.class
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  as?: string;
}>(), {
  variant: 'default',
  as: 'span',
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90';
    case 'destructive':
      return 'border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40';
    case 'outline':
      return 'text-foreground hover:bg-accent hover:text-accent-foreground';
    case 'success':
      return 'border-transparent bg-green-100 text-green-800 hover:bg-green-200';
    case 'default':
    default:
      return 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90';
  }
});
</script>
