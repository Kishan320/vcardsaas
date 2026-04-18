<template>
  <Teleport to="body">
    <SheetOverlay />
    <Transition
      :enter-active-class="`transition ease-in-out duration-500`"
      :enter-from-class="enterFromClass"
      :enter-to-class="enterToClass"
      :leave-active-class="`transition ease-in-out duration-300`"
      :leave-from-class="enterToClass"
      :leave-to-class="enterFromClass"
    >
      <div
        v-if="isOpen"
        data-slot="sheet-content"
        :class="[
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
          sideClasses,
          $attrs.class
        ]"
      >
        <slot />
        
        <button
          type="button"
          class="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          @click="onOpenChange(false)"
        >
          <XIcon class="size-4" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, computed, type Ref } from 'vue';
import { XIcon } from 'lucide-vue-next';
import SheetOverlay from './SheetOverlay.vue';

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left';
}>(), {
  side: 'right',
});

const { isOpen, onOpenChange } = inject('sheetContext') as { isOpen: Ref<boolean>, onOpenChange: (v: boolean) => void };

const sideClasses = computed(() => {
  switch (props.side) {
    case 'left':
      return 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm';
    case 'top':
      return 'inset-x-0 top-0 h-auto border-b';
    case 'bottom':
      return 'inset-x-0 bottom-0 h-auto border-t';
    case 'right':
    default:
      return 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm';
  }
});

const enterFromClass = computed(() => {
  switch (props.side) {
    case 'left': return '-translate-x-full';
    case 'top': return '-translate-y-full';
    case 'bottom': return 'translate-y-full';
    case 'right':
    default: return 'translate-x-full';
  }
});

const enterToClass = computed(() => {
  switch (props.side) {
    case 'left':
    case 'right': return 'translate-x-0';
    case 'top':
    case 'bottom': return 'translate-y-0';
    default: return 'translate-0';
  }
});
</script>
