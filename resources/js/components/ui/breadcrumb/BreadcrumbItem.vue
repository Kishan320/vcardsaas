<template>
  <li
    data-slot="breadcrumb-item"
    :class="['inline-flex items-center gap-1.5', $attrs.class]"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
// BreadcrumbItem component
</script>
