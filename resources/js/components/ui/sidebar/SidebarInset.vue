<template>
  <main
    data-slot="sidebar-inset"
    :class="[
      'bg-background relative flex min-h-svh flex-1 flex-col',
      'peer-data-[variant=inset]:min-h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0',
      $attrs.class
    ]"
  >
    <slot />
  </main>
</template>

<script setup lang="ts">
// SidebarInset component
</script>
