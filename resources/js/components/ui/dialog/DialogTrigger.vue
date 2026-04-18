<template>
  <div @click="onOpenChange(true)" :class="$attrs.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

interface DialogContext {
  onOpenChange: (value: boolean) => void;
}

const { onOpenChange } = inject('dialogContext') as DialogContext;
</script>
