<template>
  <div
    data-slot="scroll-area"
    :class="['relative overflow-hidden', $attrs.class]"
  >
    <div class="h-full w-full rounded-[inherit] overflow-auto scrollbar-hide">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// ScrollArea component
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
