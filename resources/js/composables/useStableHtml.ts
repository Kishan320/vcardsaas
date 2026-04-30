import { ref, watch } from 'vue';

/**
 * Custom composable to prevent iframe reloading in custom HTML content
 * This composable memoizes HTML content and only updates when the actual content changes
 */
export const useStableHtml = (htmlContent: string) => {
  const previousContent = ref<string>('');
  const stableContent = ref<string>('');
  
  // Only update the stable content if the HTML actually changed
  watch(htmlContent, (newContent) => {
    if (newContent !== previousContent.value) {
      previousContent.value = newContent;
      stableContent.value = newContent;
    }
  }, { immediate: true });
  
  return stableContent;
};

/**
 * Custom composable to create a stable iframe container that doesn't reload
 */
export const useStableIframe = (htmlContent: string) => {
  const containerRef = ref<HTMLDivElement | null>(null);
  const lastContentRef = ref<string>('');
  
  watch(htmlContent, (newContent) => {
    if (!containerRef.value || newContent === lastContentRef.value) {
      return;
    }
    
    // Only update if content actually changed
    if (newContent !== lastContentRef.value) {
      containerRef.value.innerHTML = newContent;
      lastContentRef.value = newContent;
    }
  });
  
  return containerRef;
};
