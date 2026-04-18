<template>
  <div data-slot="sheet-close" :class="$attrs.class" @click="onOpenChange(false)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const { onOpenChange } = inject('sheetContext') as { onOpenChange: (v: boolean) => void };
</script>
