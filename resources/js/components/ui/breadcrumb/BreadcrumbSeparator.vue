<template>
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    :class="['[&>svg]:size-3.5', $attrs.class]"
  >
    <slot>
      <ChevronRight />
    </slot>
  </li>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
</script>
