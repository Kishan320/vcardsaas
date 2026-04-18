<template>
  <div data-slot="popover-trigger" :class="$attrs.class" @click="toggle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const { toggle } = inject('popoverContext') as { toggle: () => void };
</script>
