import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useModalStack } from '@/contexts/ModalStackContext';

export function useStackedModal(baseId?: string, externalIsOpen?: boolean) {
  const { registerModal, unregisterModal, getZIndex } = useModalStack();
  const modalId = ref(baseId || `modal-${Date.now()}-${Math.random()}`);
  const internalIsOpen = ref(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen.value;

  watch(isOpen, (newValue) => {
    if (newValue) {
      registerModal(modalId.value);
    } else {
      unregisterModal(modalId.value);
    }
  }, { immediate: true });

  onUnmounted(() => {
    unregisterModal(modalId.value);
  });

  const zIndex = getZIndex(modalId.value);

  return {
    modalId,
    isOpen,
    setIsOpen: (value: boolean) => internalIsOpen.value = value,
    zIndex,
    open: () => internalIsOpen.value = true,
    close: () => internalIsOpen.value = false,
    toggle: () => internalIsOpen.value = !internalIsOpen.value
  };
}
