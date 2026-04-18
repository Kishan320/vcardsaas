<template>
  <nav
    data-slot="navigation-menu"
    :data-viewport="viewport"
    :class="[
      'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
      $attrs.class
    ]"
  >
    <slot />
    <div v-if="viewport" class="absolute top-full left-0 isolate z-50 flex justify-center">
       <!-- simple viewport implementation if needed -->
    </div>
  </nav>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';

withDefaults(defineProps<{
  viewport?: boolean;
}>(), {
  viewport: true,
});

const value = ref<string | null>(null);

const onValueChange = (val: string | null) => {
  value.value = val;
};

provide('navigationMenuContext', {
  value,
  onValueChange,
});
</script>
