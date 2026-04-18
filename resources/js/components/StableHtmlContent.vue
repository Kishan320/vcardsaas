<template>
  <div ref="containerRef" :class="className" :style="style" />
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

interface StableHtmlContentProps {
  htmlContent: string;
  className?: string;
  style?: any;
}

const props = withDefaults(defineProps<StableHtmlContentProps>(), {
  className: '',
  style: () => ({})
});

const containerRef = ref<HTMLDivElement>();
const lastContentRef = ref('');

watch(() => props.htmlContent, async (newContent) => {
  if (!containerRef.value) return;

  // Only update DOM if content actually changed
  if (newContent !== lastContentRef.value) {
    await nextTick();
    containerRef.value.innerHTML = newContent;
    lastContentRef.value = newContent;
  }
}, { immediate: true });
</script>

<style scoped>
.stable-html-content {
  /* Component styles are handled by the style prop */
}
</style>
