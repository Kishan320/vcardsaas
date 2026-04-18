<template>
  <div
    data-slot="sidebar-wrapper"
    :style="{
      '--sidebar-width': '16rem',
      '--sidebar-width-icon': '3rem',
    }"
    :class="[
      'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, onMounted, onUnmounted } from 'vue';
import { useIsMobile } from '@/composables/useIsMobile';

const props = withDefaults(defineProps<{
  defaultOpen?: boolean;
  open?: boolean;
}>(), {
  defaultOpen: true,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const isMobile = useIsMobile();
const openMobile = ref(false);
const _open = ref(props.defaultOpen);

const open = computed({
  get: () => props.open ?? _open.value,
  set: (val) => {
    _open.value = val;
    emit('update:open', val);
    // Set cookie logic similar to React version if needed
    document.cookie = `sidebar_state=${val}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
});

const state = computed(() => open.value ? 'expanded' : 'collapsed');

const toggleSidebar = () => {
  if (isMobile.value) {
    openMobile.value = !openMobile.value;
  } else {
    open.value = !open.value;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    toggleSidebar();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

provide('sidebarContext', {
  state,
  open,
  setOpen: (val: boolean) => open.value = val,
  openMobile,
  setOpenMobile: (val: boolean) => openMobile.value = val,
  isMobile,
  toggleSidebar,
});
</script>
