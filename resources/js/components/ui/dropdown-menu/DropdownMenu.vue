<template>
  <div class="relative inline-block w-full">
    <slot :open="isOpen" />
    
    <!-- Global Overlay to close dropdown when clicking outside -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        @click="close"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const closeOnEscape = (e: KeyboardEvent) => {
  if (isOpen.value && e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', closeOnEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
});

provide('dropdownContext', {
  isOpen,
  toggle,
  close,
});
</script>
