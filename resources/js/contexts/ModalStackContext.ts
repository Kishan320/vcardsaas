import { ref, computed } from 'vue';

const modalStack = ref<string[]>([]);
const baseZIndex = 50;

export function useModalStack() {
  const registerModal = (id: string) => {
    if (!modalStack.value.includes(id)) {
      modalStack.value.push(id);
    }
    return baseZIndex;
  };

  const unregisterModal = (id: string) => {
    modalStack.value = modalStack.value.filter(modalId => modalId !== id);
  };

  const getZIndex = (id: string) => {
    const index = modalStack.value.indexOf(id);
    return index >= 0 ? baseZIndex + index : baseZIndex;
  };

  return {
    registerModal,
    unregisterModal,
    getZIndex,
    modalStack: computed(() => modalStack.value),
  };
}
