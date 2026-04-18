<template>
  <button
    type="button"
    data-slot="select-trigger"
    :class="[
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      $attrs.class
    ]"
    @click="toggle"
  >
    <slot />
    <ChevronDown class="h-4 w-4 opacity-50" />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const { toggle } = inject('selectContext') as { toggle: () => void };
</script>
