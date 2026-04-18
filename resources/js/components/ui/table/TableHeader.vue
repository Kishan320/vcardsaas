<template>
  <thead
    data-slot="table-header"
    :class="['[&_tr]:border-b', $attrs.class]"
  >
    <slot />
  </thead>
</template>

<script setup lang="ts">
// TableHeader component
</script>
