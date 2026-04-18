<template>
  <span
    data-slot="breadcrumb-page"
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="['font-normal text-foreground', $attrs.class]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
// BreadcrumbPage component
</script>
