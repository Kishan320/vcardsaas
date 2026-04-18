<template>
  <div
    role="alert"
    :class="[
      'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
      variantClass,
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'destructive'
}>(), {
  variant: 'default',
});

const variantClass = computed(() => {
  return props.variant === 'destructive'
    ? 'text-destructive-foreground [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/80'
    : 'bg-background text-foreground';
});
</script>
