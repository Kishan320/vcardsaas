<template>
  <ul
    data-slot="navigation-menu-list"
    :class="[
      'group flex flex-1 list-none items-center justify-center gap-1',
      $attrs.class
    ]"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
// NavigationMenuList component
</script>
