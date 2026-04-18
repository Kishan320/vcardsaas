<template>
  <component
    :is="as"
    data-slot="breadcrumb-link"
    :class="['transition-colors hover:text-foreground', $attrs.class]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  as?: string;
}>(), {
  as: 'a',
});
</script>
