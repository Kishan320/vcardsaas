<template>
  <div
    data-slot="separator-root"
    :data-orientation="orientation"
    :class="[
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      $attrs.class
    ]"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}>(), {
  orientation: 'horizontal',
  decorative: true,
});
</script>
