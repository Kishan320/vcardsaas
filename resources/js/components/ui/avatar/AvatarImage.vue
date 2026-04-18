<template>
  <img
    v-if="!hasError"
    data-slot="avatar-image"
    :src="src"
    :alt="alt"
    :class="['aspect-square size-full', $attrs.class]"
    @error="handleError"
  />
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  src?: string;
  alt?: string;
}>();

const hasError = ref(false);

const handleError = () => {
  hasError.value = true;
};

watch(() => props.src, () => {
  hasError.value = false;
});
</script>
