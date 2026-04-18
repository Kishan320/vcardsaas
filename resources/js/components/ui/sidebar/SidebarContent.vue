<template>
  <div
    data-slot="sidebar-content"
    data-sidebar="content"
    :class="[
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// SidebarContent component
</script>
