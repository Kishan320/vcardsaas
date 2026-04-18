<template>
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
      data-slot="select-content"
      :class="[
        'absolute z-[100] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md mt-1 w-full',
        $attrs.class
      ]"
    >
      <div class="p-1">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { isOpen } = inject('selectContext') as { isOpen: Ref<boolean> };
</script>
