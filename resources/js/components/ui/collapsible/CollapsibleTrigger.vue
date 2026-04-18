<template>
  <button
    type="button"
    data-slot="collapsible-trigger"
    :class="$attrs.class"
    @click="toggle"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const { toggle } = inject('collapsibleContext') as { toggle: () => void };
</script>
