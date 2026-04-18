<template>
  <div
    data-slot="dropdown-menu-trigger"
    :class="['hover:bg-transparent cursor-pointer', $attrs.class]"
    @click="toggle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const { toggle } = inject('dropdownContext') as { toggle: () => void };
</script>
