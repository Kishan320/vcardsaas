import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export type LayoutPosition = 'left' | 'right';

const position = ref<LayoutPosition>('left');
const isRtl = ref<boolean>(false);

export const effectivePosition = computed<LayoutPosition>(() => {
  return isRtl.value ? (position.value === 'left' ? 'right' : 'left') : position.value;
});

export function useLayout() {
  const updatePosition = (val: LayoutPosition) => {
    position.value = val;
    localStorage.setItem('layoutPosition', val);
  };

  const checkRtl = () => {
    isRtl.value = document.documentElement.dir === 'rtl';
  };

  onMounted(() => {
    const storedPosition = localStorage.getItem('layoutPosition') as LayoutPosition;
    if (storedPosition === 'left' || storedPosition === 'right') {
      position.value = storedPosition;
    }

    checkRtl();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'dir') {
          checkRtl();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    onUnmounted(() => {
      observer.disconnect();
    });
  });

  return {
    position,
    effectivePosition,
    updatePosition,
    isRtl,
  };
}
