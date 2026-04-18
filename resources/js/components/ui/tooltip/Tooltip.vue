<template>
  <div class="relative inline-block" @mouseenter="show" @mouseleave="hide">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

const isOpen = ref(false);
const show = () => isOpen.value = true;
const hide = () => isOpen.value = false;

provide('tooltipContext', { isOpen, show, hide });
</script>
