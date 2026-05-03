import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export type LayoutPosition = 'ltr' | 'rtl';

const position = ref<LayoutPosition>('ltr');
const isRtl = ref<boolean>(false);

export const effectivePosition = computed<LayoutPosition>(() => {
  return position.value;
});

export function useLayout() {
  const updatePosition = (val: LayoutPosition) => {
    position.value = val;
    const dir = val === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('dir', dir);
    isRtl.value = val === 'rtl';
  };

  const checkRtl = () => {
    isRtl.value = document.documentElement.dir === 'rtl';
    position.value = isRtl.value ? 'rtl' : 'ltr';
  };

  onMounted(() => {
    checkRtl();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'dir') checkRtl();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    onUnmounted(() => observer.disconnect());
  });

  return { position, effectivePosition, updatePosition, isRtl };
}
