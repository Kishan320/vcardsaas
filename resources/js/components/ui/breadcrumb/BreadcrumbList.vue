<template>
  <ol
    data-slot="breadcrumb-list"
    :class="[
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      $attrs.class
    ]"
  >
    <slot />
  </ol>
</template>

<script setup lang="ts">
// BreadcrumbList component
</script>
