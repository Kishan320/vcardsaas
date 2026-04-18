<template>
  <DialogPortal>
    <DialogOverlay :modalId="currentModalId" />
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
        ref="contentRef"
        data-slot="dialog-content"
        :class="[
          'fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          $attrs.class
        ]"
        :style="{ zIndex: zIndex + 1 }"
        @click.stop
      >
        <slot />
        
        <button
          type="button"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          @click="onOpenChange(false)"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Transition>
  </DialogPortal>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted, computed } from 'vue';
import { X } from 'lucide-vue-next';
import DialogPortal from './DialogPortal.vue';
import DialogOverlay from './DialogOverlay.vue';
import { useModalStack } from '@/composables/useModalStack';

interface DialogContext {
  isOpen: { value: boolean };
  onOpenChange: (value: boolean) => void;
}

const { isOpen, onOpenChange } = inject('dialogContext') as DialogContext;
const { registerModal, unregisterModal, getZIndex } = useModalStack();

const props = defineProps<{
  modalId?: string;
}>();

const currentModalId = ref(props.modalId || `modal-${Date.now()}-${Math.random()}`);
const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
  registerModal(currentModalId.value);
});

onUnmounted(() => {
  unregisterModal(currentModalId.value);
});

const zIndex = computed(() => getZIndex(currentModalId.value));
</script>
