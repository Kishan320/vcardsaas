<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue';

const props = withDefaults(defineProps<{
  delayDuration?: number;
}>(), {
  delayDuration: 0,
});

provide('tooltipProviderContext', {
  delayDuration: props.delayDuration,
});
</script>
