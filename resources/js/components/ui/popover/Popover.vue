<template>
  <div class="relative inline-block w-full">
    <slot :open="isOpen" />
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-40" @click="close" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

const isOpen = ref(false);
const toggle = () => isOpen.value = !isOpen.value;
const close = () => isOpen.value = false;

provide('popoverContext', { isOpen, toggle, close });
</script>
