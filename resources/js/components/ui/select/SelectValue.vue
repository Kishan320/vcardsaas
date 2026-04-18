<template>
  <span data-slot="select-value">
    <slot>{{ selectedValue }}</slot>
  </span>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { selectedValue } = inject('selectContext') as { selectedValue: Ref<string|undefined> };
</script>
