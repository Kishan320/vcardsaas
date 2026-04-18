<template>
    <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="visible" class="fixed top-4 right-4 z-[100] max-w-sm w-full">
            <div
                class="flex items-start gap-3 px-4 py-3 rounded-xl shadow-modal border text-sm font-medium"
                :class="typeClasses"
            >
                <component :is="icon" :size="16" class="mt-0.5 flex-shrink-0" />
                <span class="flex-1">{{ message }}</span>
                <button @click="visible = false" class="flex-shrink-0 opacity-60 hover:opacity-100">
                    <X :size="14" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next';
import type { PageProps } from '@/types';

const page = usePage<PageProps>();
const visible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'warning' | 'info'>('success');

const typeClasses = computed(() => ({
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
}[type.value]));

const icon = computed(() => ({
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
}[type.value]));

const showFlash = (flash: PageProps['flash']) => {
    if (flash?.success) { message.value = flash.success; type.value = 'success'; visible.value = true; }
    else if (flash?.error) { message.value = flash.error; type.value = 'error'; visible.value = true; }
    else if (flash?.warning) { message.value = flash.warning; type.value = 'warning'; visible.value = true; }
    else if (flash?.info) { message.value = flash.info; type.value = 'info'; visible.value = true; }

    if (visible.value) setTimeout(() => { visible.value = false; }, 4000);
};

watch(() => page.props.flash, showFlash, { deep: true });
onMounted(() => showFlash(page.props.flash));
</script>
