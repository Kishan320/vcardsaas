<template>
  <div
    data-slot="sidebar-header"
    data-sidebar="header"
    :class="['flex flex-col gap-2 p-2', $attrs.class]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// SidebarHeader component
</script>
