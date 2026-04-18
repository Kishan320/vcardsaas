<template>
  <div
    data-slot="sidebar-group"
    data-sidebar="group"
    :class="['relative flex w-full min-w-0 flex-col p-2', $attrs.class]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// SidebarGroup component
</script>
