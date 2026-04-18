<template>
  <div
    v-show="isOpen"
    data-slot="collapsible-content"
    :class="$attrs.class"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { isOpen } = inject('collapsibleContext') as { isOpen: Ref<boolean> };
</script>
