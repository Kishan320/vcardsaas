<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        data-slot="tooltip-content"
        :class="[
          'bg-primary text-primary-foreground z-50 max-w-sm rounded-md px-3 py-1.5 text-xs fixed',
          $attrs.class
        ]"
        :style="positionStyle"
      >
        <slot />
        <div class="bg-primary fill-primary z-50 size-2.5 rotate-45 rounded-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, type Ref, computed } from 'vue';

const { isOpen } = inject('tooltipContext') as { isOpen: Ref<boolean> };

// Simplified positioning for now
const positionStyle = computed(() => ({
  // In a real implementation, we'd use useElementBounding from @vueuse/core to position correctly
  // For the UI conversion phase, we'll keep it layout-neutral
}));
</script>
