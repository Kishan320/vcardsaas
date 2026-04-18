<template>
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    :class="['flex size-9 items-center justify-center', $attrs.class]"
  >
    <MoreHorizontal class="size-4" />
    <span class="sr-only">More</span>
  </span>
</template>

<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next';
</script>
