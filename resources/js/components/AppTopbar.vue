<template>
    <header class="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-4 flex-shrink-0 z-30">
        <!-- Mobile menu toggle -->
        <button @click="$emit('menu-click')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
            <Menu :size="18" class="text-gray-600" />
        </button>

        <!-- Desktop collapse toggle -->
        <button
            @click="$emit('collapse-toggle')"
            class="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <PanelLeftClose v-if="!sidebarCollapsed" :size="18" class="text-gray-500" />
            <PanelLeftOpen v-else :size="18" class="text-gray-500" />
        </button>

        <!-- Search -->
        <div class="flex-1 max-w-md">
            <div class="relative">
                <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search…"
                    class="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-gray-400"
                />
            </div>
        </div>

        <div class="flex items-center gap-1 ml-auto">
            <!-- Notifications -->
            <div class="relative" ref="notifRef">
                <button
                    @click="notifOpen = !notifOpen; profileOpen = false"
                    class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Bell :size="18" class="text-gray-600" />
                    <span v-if="hasFlash" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div
                    v-if="notifOpen"
                    class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-modal border border-gray-100 z-50 animate-fade-in overflow-hidden"
                >
                    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span class="text-sm font-semibold text-gray-900">Notifications</span>
                    </div>
                    <div v-if="flash?.success" class="flex items-start gap-3 px-4 py-3 bg-green-50">
                        <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-green-500" />
                        <p class="text-sm text-green-800">{{ flash.success }}</p>
                    </div>
                    <div v-if="flash?.error" class="flex items-start gap-3 px-4 py-3 bg-red-50">
                        <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-500" />
                        <p class="text-sm text-red-800">{{ flash.error }}</p>
                    </div>
                    <div v-if="!hasFlash" class="px-4 py-6 text-center text-sm text-gray-400">
                        No new notifications
                    </div>
                </div>
            </div>

            <!-- Profile -->
            <div class="relative" ref="profileRef">
                <button
                    @click="profileOpen = !profileOpen; notifOpen = false"
                    class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {{ initials }}
                    </div>
                    <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ user?.name }}</span>
                    <ChevronDown :size="14" class="text-gray-400" />
                </button>

                <div
                    v-if="profileOpen"
                    class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-modal border border-gray-100 z-50 animate-fade-in overflow-hidden"
                >
                    <div class="px-4 py-3 border-b border-gray-100">
                        <p class="text-sm font-semibold text-gray-900">{{ user?.name }}</p>
                        <p class="text-xs text-gray-500">{{ user?.email }}</p>
                    </div>
                    <Link
                        :href="route('profile')"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <User :size="14" class="text-gray-400" /> Profile
                    </Link>
                    <Link
                        :href="route('settings')"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Settings :size="14" class="text-gray-400" /> Settings
                    </Link>
                    <div class="border-t border-gray-100">
                        <Link
                            :href="route('logout')"
                            method="post"
                            as="button"
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut :size="14" /> Sign Out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
    Menu, Search, Bell, ChevronDown, Settings, LogOut,
    User, PanelLeftClose, PanelLeftOpen,
} from 'lucide-vue-next';
import type { PageProps } from '@/types';

defineProps<{ sidebarCollapsed: boolean }>();
defineEmits(['menu-click', 'collapse-toggle']);

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);
const flash = computed(() => page.props.flash);
const hasFlash = computed(() => !!(flash.value?.success || flash.value?.error));

const initials = computed(() => {
    const name = user.value?.name ?? '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

const profileOpen = ref(false);
const notifOpen = ref(false);
</script>
