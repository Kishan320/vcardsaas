<template>
  <div data-slot="sheet-trigger" :class="$attrs.class" @click="onOpenChange(true)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { onOpenChange } = inject('sheetContext') as { onOpenChange: (v: boolean) => void };
</script>
