<template>
  <div v-if="error" :class="['flex items-center justify-center bg-muted text-muted-foreground', $attrs.class]">
    <span>Image not found</span>
  </div>
  <img
    v-else
    ref="imgRef"
    :src="src"
    :alt="alt"
    :class="[
      $attrs.class,
      !isLoaded && loadingClassName,
      'transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0'
    ]"
    loading="lazy"
    @load="isLoaded = true"
    @error="error = true"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = withDefaults(defineProps<{
  src: string;
  alt: string;
  loadingClassName?: string;
}>(), {
  loadingClassName: 'animate-pulse bg-muted',
});

const isLoaded = ref(false);
const error = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

watch(() => props.src, () => {
  isLoaded.value = false;
  error.value = false;
});

onMounted(() => {
  if (imgRef.value?.complete) {
    isLoaded.value = true;
  }
});
</script>
