import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollAnimation(threshold = 0.1) {
  const isVisible = ref(false);
  const elementRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    if (!elementRef.value) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(elementRef.value);

    onUnmounted(() => {
      observer.disconnect();
    });
  });

  return { elementRef, isVisible };
}
