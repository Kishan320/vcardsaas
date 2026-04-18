import { ref, computed } from 'vue';

const modalStack = ref<string[]>([]);
const baseZIndex = 50;

export function useModalStack() {
  const registerModal = (id: string) => {
    if (!modalStack.value.includes(id)) {
      modalStack.value.push(id);
    }
  };

  const unregisterModal = (id: string) => {
    modalStack.value = modalStack.value.filter(m => m !== id);
  };

  const getZIndex = (id: string) => {
    const index = modalStack.value.indexOf(id);
    return index >= 0 ? baseZIndex + index * 10 : baseZIndex;
  };

  return {
    modalStack: computed(() => modalStack.value),
    registerModal,
    unregisterModal,
    getZIndex
  };
}
