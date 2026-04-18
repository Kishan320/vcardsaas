<template>
  <img 
    v-if="imageSrc"
    :src="imageSrc" 
    :alt="alt" 
    :class="className"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

interface ImagePreviewProps {
  src: string | File | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  alt: 'Image',
  className: 'h-16 w-20 rounded-md object-cover shadow-sm'
});

const imageSrc = ref<string | null>(null);
let objectUrl: string | null = null;

watch(() => props.src, (newSrc) => {
  if (!newSrc) {
    imageSrc.value = null;
    return;
  }
  
  // Clean up previous URL if it exists
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  
  // If src is a string (URL), use it directly
  if (typeof newSrc === 'string') {
    imageSrc.value = newSrc;
    return;
  }
  
  // If src is a File object, create a preview URL
  if (newSrc instanceof File) {
    objectUrl = URL.createObjectURL(newSrc);
    imageSrc.value = objectUrl;
  }
}, { immediate: true });

onUnmounted(() => {
  // Clean up the URL when component unmounts
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
});
</script>

<style scoped>
.image-preview {
  /* Component styles are handled by Tailwind classes */
}
</style>
